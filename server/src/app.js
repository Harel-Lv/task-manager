import express from "express";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Task Manager API is running" });
});

app.use("/api/tasks", taskRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;