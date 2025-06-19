import mongoose from "mongoose";

const taskManagementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title."],
    minLength: [3, "Title must contain at least 3 Characters!"],
    maxLength: [30, "Title cannot exceed 30 Characters!"],
  },
  description: {
    type: String,
    required: [true, "Please provide decription."],
    minLength: [2, "Description must contain at least 30 Characters!"],
    maxLength: [500, "Description cannot exceed 500 Characters!"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "userSchema",
  },
  status: {
    type: String,
    default: "Pending",
  },

 
 
});

export const Task = mongoose.model("Job", taskManagementSchema);
