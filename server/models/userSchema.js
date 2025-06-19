import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ms from "ms";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your Name!"],
    minLength: [3, "Name must contain at least 3 Characters!"],
    maxLength: [30, "Name cannot exceed 30 Characters!"],
  },
  email: {
    type: String,
    required: [true, "Please enter your Email!"],
    validate: [validator.isEmail, "Please provide a valid Email!"],
  },
  phone: {
    type: Number,
    required: [false, "Please enter your Phone Number!"],
  },
  password: {
    type: String,
    required: [true, "Please provide a Password!"],
    minLength: [2, "Password must contain at least 8 characters!"],
    maxLength: [32, "Password cannot exceed 32 characters!"],
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});



userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


userSchema.methods.getJWTToken = function () {

  return jwt.sign({ id: this._id }, "12969faa3de4be9e87c514f2cb82b54ab5c21eb28a9c4c15d9ab16c1a396391c", {
    expiresIn: "10h",
  });
};

export const User = mongoose.model("User", userSchema);
