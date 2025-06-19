import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("User Not Authorized", 401));
  }
  const decoded = jwt.verify(token, "12969faa3de4be9e87c514f2cb82b54ab5c21eb28a9c4c15d9ab16c1a396391c");

  req.decoded = decoded;
  req.user = await User.findById(decoded.id);

  next();
});``
