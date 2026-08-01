import prisma from "../config/prisma.js";

export async function getAllTasks() {
  return prisma.task.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createTask(taskData) {
  return prisma.task.create({
    data: taskData,
  });
}

export async function getTaskById(id) {
  return prisma.task.findUnique({
    where: { id },
  });
}

export async function updateTaskById(id, taskData) {
  return prisma.task.update({
    where: { id },
    data: taskData,
  });
}

export async function deleteTaskById(id) {
  return prisma.task.delete({
    where: { id },
  });
}