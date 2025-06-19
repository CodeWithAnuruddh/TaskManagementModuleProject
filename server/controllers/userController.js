import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";


export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return next(new ErrorHandler("Please fill full form!", 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("Email already registered!", 409));
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
  });

  sendToken(user, 201, res, "User Registered!");
});


export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password.", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password.", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);
  console.log("paswrod matched --> ",isPasswordMatched);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password.", 401));
  }

  console.log("till end ---->")
  sendToken(user, 200, res, "User Logged In!");
});


export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logged Out Successfully.",
    });
});


export const getUser = catchAsyncErrors((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});
