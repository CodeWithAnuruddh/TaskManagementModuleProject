import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { Task } from "../models/taskManagement.js";
import ErrorHandler from "../middlewares/error.js";
import jwt from "jsonwebtoken";

export const getAllTask = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.query;
  const token = req.cookies.token;
  const userId = decodeTokenAndGetId(token);

  const query = { userId };

  if (status) {
    query.status = status;
  }

  const tasks = await Task.find(query);

  res.status(200).json({
    success: true,
    tasks,
  });
});

export const createTask = catchAsyncErrors(async (req, res, next) => {
  const { title, description, status } = req.body;
  const token = req.cookies.token;
  const userId = decodeTokenAndGetId(token);

  const task = await Task.create({
    title,
    description,
    status: status || "Pending",
    userId,
  });

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    task,
  });
});

export const editTask = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  const task = await Task.findOneAndUpdate(
    { _id: id, userId: req.user._id }, 
    { title, description, status },
    { new: true, runValidators: true }
  );

  if (!task) {
    return res.status(404).json({ success: false, message: "Task not found" });
  }

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    task,
  });
});

export const deleteTask = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const task = await Task.findOneAndDelete({ _id: id, userId: req.user._id });

  if (!task) {
    return res.status(404).json({ success: false, message: "Task not found" });
  }

  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
  });
});

export const decodeTokenAndGetId = (token) => {
  try {
    const decoded = jwt.verify(
      token,
      "12969faa3de4be9e87c514f2cb82b54ab5c21eb28a9c4c15d9ab16c1a396391c"
    );

    return decoded.id;
  } catch (error) {
    console.error("Invalid or expired token:", error.message);
    return null;
  }
};
