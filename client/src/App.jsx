import { useEffect, useState } from "react";
import { createTask, getTasks, updateTask, deleteTask } from "./services/taskService";

function App() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
 
 
 
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


  return (
    <div>
      <h1>Task Manager</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
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
      
      {tasks.length === 0 ? (
        <p>No tasks yet</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <h2>{task.title}</h2>

              {task.description && <p>{task.description}</p>}

              <p>Status: {task.completed ? "Completed" : "Incomplete"}</p>
              <button onClick={() => handleToggleComplete(task)}>
               {task.completed ? "MARK INCOMPLETE" : "MARK COMPLETE"}
              </button>

              <button onClick={() => handleDeleteTask(task.id)}>DELETE</button>

            </li>

          ))}
        </ul>
      )}
    </div>
  );
}

export default App;