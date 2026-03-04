import express from "express";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controller/taskController.js";

const taskRouter = express.Router();

taskRouter.get("/", getAllTasks);
taskRouter.post("/", createTask);
taskRouter.put("/:id", updateTask);
taskRouter.delete("/:id", deleteTask);

export default taskRouter;
