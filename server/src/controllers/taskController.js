import {
  getAllTasks,
  createTask,
  getTaskById,
  updateTaskById,
  deleteTaskById,
} from "../services/taskService.js";

export async function getTasks(req, res, next) {
  try {
    const tasks = await getAllTasks();

    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
}

export async function addTask(req, res, next) {
  try {
    const { title, description, completed } = req.body;

    if (!title || typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({
        message: "Title is required",
      });
    }
       if (
         description !== undefined &&
         description !== null &&
         typeof description !== "string"
      ) {
        return res.status(400).json({
        message: "Description must be a string",
       });
}
      if (completed !== undefined && typeof completed !== "boolean") {
      return res.status(400).json({
        message: "Completed must be a boolean",
      });
    }

    const task = await createTask({
      title: title.trim(),
      description: description?.trim() || null,
      completed: completed ?? false,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
}
export async function getTask(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "Invalid task id",
      });
    }

    const task = await getTaskById(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }


    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
}

export async function updateTask(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid task id",
        });
    }
    const existingTask = await getTaskById(id);

    if (!existingTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const { title, description, completed } = req.body;

if (title !== undefined) {
      if (typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({
          message: "Title must be a non-empty string",
        });
      }
    }

    if (description !== undefined && description !== null) {
      if (typeof description !== "string") {
        return res.status(400).json({
          message: "Description must be a string",
        });
      }
    }

    if (completed !== undefined && typeof completed !== "boolean") {
      return res.status(400).json({
        message: "Completed must be a boolean",
      });
    }

    const updatedTask = await updateTaskById(id, {
      ...(title !== undefined && { title: title.trim() }),
      ...(description !== undefined && {
        description:
          typeof description === "string" && description.trim() !== ""
            ? description.trim()
            : null,
      }),
      ...(completed !== undefined && { completed }),
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
}

export async function deleteTask(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid task id",
        });
    }

    const existingTask = await getTaskById(id);

    if (!existingTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    await deleteTaskById(id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
