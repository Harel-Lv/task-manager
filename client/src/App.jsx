import { useEffect, useState } from "react";
import { createTask, getTasks, updateTask, deleteTask } from "./services/taskService";

function App() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
 const [searchTerm, setSearchTerm] = useState("");
 const [Statusfilter, setStatusFilter] = useState("all");
 
 
  useEffect(() => {
    async function fetchTasks() {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();}, []);

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    
    if (title.trim() === "") {
      setError("Title is required");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const newTask = await createTask({ title: title.trim(), description: description?.trim() || null });
      setTasks(currentTasks => [newTask, ...currentTasks]);
      setTitle("");
      setDescription("");
    }

    catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }}


    async function handleToggleComplete(task) {

      setError(null);
      try {
        const updatedTask = await updateTask(task.id, { completed: !task.completed });
        setTasks(currentTasks =>
          currentTasks.map(t => (t.id === task.id ? updatedTask : t))
        );
      }
      catch (err) {
        setError(err.message);
      }
    }

     async function handleDeleteTask(Id) {
      setError(null);
      try {
        await deleteTask(Id);
        setTasks(currentTasks => currentTasks.filter(t => t.id !== Id));
      } catch (err) {
        setError(err.message);
      }
    }

    function handleEditTask(task) {
      setEditingTaskId(task.id);
      setEditingTitle(task.title);
      setEditingDescription(task.description || "");
      setError(null);
    }

    function handleCancelEdit() {
      setEditingTaskId(null);
      setEditingTitle("");
      setEditingDescription("");
    }

    async function handleUpdateTask() {
      if (editingTitle.trim() === "") {
        setError("Title is required");
        return;
      }
      try {
        setError(null);
        const updatedTask = await updateTask(editingTaskId, {
          title: editingTitle.trim(),
          description: editingDescription.trim() || null,
        });
        setTasks(currentTasks =>
          currentTasks.map(t => (t.id === editingTaskId ? updatedTask : t))
        );
        handleCancelEdit();
      } catch (err) {
        setError(err.message);
      }
    }

    const filteredTasks = tasks.filter(task => {
      const matchesSearchTerm = task.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatusFilter =
        Statusfilter === "all" ||
        (Statusfilter === "completed" && task.completed) ||
        (Statusfilter === "incomplete" && !task.completed);
      return matchesSearchTerm && matchesStatusFilter;
    });


  return (
    <div  className="app">


      <h1>Task Manager</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form className="task-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
          />
        </div>

        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description (optional)"
          />
        </div>
        
        <button type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add Task"}
        </button>

      </form>

      <section>

        <label htmlFor="sreach">sreach task</label>

        <input

        id="search"
        type="search"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder="Search by title"
        ></input>


      <label htmlFor="status-filter">Filter by status:</label>

      <select
        id="status-filter"
        value={Statusfilter}
        onChange={(event) => setStatusFilter(event.target.value)}
      >
        <option value="all">All</option>
        <option value="completed">Completed</option>
        <option value="incomplete">Incomplete</option>
      </select>
      </section>

      
      {filteredTasks.length === 0 ? (
        <p>No tasks yet</p>
      ) : (
        <ul className="task-list">
          {filteredTasks.map((task) => (
            <li key={task.id}
             className={`task-card ${task.completed ? "completed" : ""}`}>      
            {editingTaskId === task.id ? (
              <div>
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                />
                <textarea
                  value={editingDescription}
                  onChange={(e) => setEditingDescription(e.target.value)}
                />
                
                <button onClick={handleUpdateTask}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </div>
            ) : (
              <div className="task-actions">
              <h2>{task.title}</h2>
              {task.description && <p>{task.description}</p>}
              <p>status: {task.completed ? "Completed" : "Incomplete"}</p>
              <button onClick={() => handleEditTask(task)}>
                Edit
              </button>
              <button onClick={() => handleToggleComplete(task)}>
                {task.completed ? "Mark Incomplete" : "Mark Complete"}
              </button>
              <button onClick={() => handleDeleteTask(task.id)}>
                Delete
              </button>
            </div>
            )}

         

          </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;