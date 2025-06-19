import express from "express";
import {
  getAllTask,
  createTask,
  editTask,
  deleteTask
} from "../controllers/taskManagementController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/getall", getAllTask);
router.post("/post", isAuthenticated, createTask);
router.put("/update/:id", isAuthenticated, editTask);
router.delete("/delete/:id", isAuthenticated, deleteTask);

export default router;
