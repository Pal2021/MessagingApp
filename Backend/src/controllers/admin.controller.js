import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Admin } from "../models/admin.model.js";
import { MassageSchema } from "../models/user.model.js";
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

  const existingUser = await Admin.findOne({ username });
  if (existingUser) {
    throw new ApiError(409, "Email already taken");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await Admin.create({
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

const loginAdmin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ApiError(400, "Username and password are required");
  }

  const user = await Admin.findOne({ username });
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
    .json(new ApiResponse(200, { token }, "Admin signed in successfully"));
});

const sendMessage = asyncHandler(async (req, res) => {
  const { message, senderId } = req.body; // Ensure userId is passed in the request body if needed
  console.log(`Sender ID: ${senderId}, Message: ${message}`);
  // Check if the message content is provided
  if (!message) {
    return res.status(400).json({ error: "Message content is required" });
  }

  // Ensure senderId is available from the token (req.userId should come from JWT authentication middleware)
  //const senderId = req.userId; // If senderId is not part of the body, it should be set via authentication middleware

  if (!senderId) {
    return res.status(400).json({ error: "Sender ID is missing or invalid" });
  }

  console.log(`Sender ID: ${senderId}, Message: ${message}`);

  try {
    // Save the new message to the database
    const newMessage = await MassageSchema.create({
      senderId,
      message,
      isCompleted: false,
    });

    // Respond with success message and the saved message
    res.status(201).json({
      statusCode: 201,
      data: newMessage,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Server error while sending message" });
  }
});

const getAllMessages = asyncHandler(async (_, res) => {
  const messages = await MassageSchema.find({ isCompleted: false })
    .populate("senderId", "username firstName lastName")
    .sort({ createdAt: -1 });

  if (!messages || messages.length === 0) {
    throw new ApiError(404, "No messages found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, messages, "Messages fetched successfully"));
});

export { signup, loginAdmin, sendMessage, getAllMessages };
