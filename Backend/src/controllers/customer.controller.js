import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User, MassageSchema } from "../models/user.model.js";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const signup = asyncHandler(async (req, res) => {
  const { username, firstName, lastName, password } = req.body;

  if (!username || !firstName || !lastName || !password) {
    throw new ApiError(400, "All fields are required");
  }

  if (!isValidEmail(username)) {
    throw new ApiError(400, "Invalid email format");
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new ApiError(409, "Email already taken");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username,
    firstName,
    lastName,
    password: hashedPassword,
  });

  const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res
    .status(201)
    .json(new ApiResponse(201, { token }, "User created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ApiError(400, "Username and password are required");
  }

  const user = await User.findOne({ username });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Wrong credentials");
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res
    .status(200)
    .json(new ApiResponse(200, { token }, "User signed in successfully"));
});

const sendMessage = asyncHandler(async (req, res) => {
  const { message } = req.body; // Get message from the request body
  const { userId: senderId } = req.user; // Get userId from req.user, set by authMiddleware

  if (!message) {
    return res.status(400).json({ error: "Message content is required" });
  }

  // Create a new message in the database
  const newMessage = await MassageSchema.create({
    senderId,
    message,
    isCompleted: false,
  });

  res
    .status(201)
    .json(new ApiResponse(201, newMessage, "Message sent successfully"));
});

const getAllMessages = asyncHandler(async (req, res) => {
  const { userId } = req.user; // Access userId from req.user
  console.log(userId); // This should now print the correct userId

  const messages = await MassageSchema.find({ senderId: userId });

  if (!messages || messages.length === 0) {
    throw new ApiError(404, "No messages found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, messages, "Messages fetched successfully"));
});

export { signup, loginUser, sendMessage, getAllMessages };
