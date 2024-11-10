import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User, MassageSchema } from "../models/user.model.js";
// Controller to handle sending messages
const sendMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;

  // Check if the message content is provided
  if (!message) {
    return res.status(400).json({ error: "Message content is required" });
  }

  // Get the senderId from the authenticated user (from authMiddleware)
  const senderId = req.userId;

  // Log the incoming message for debugging
  console.log(`Sender ID: ${senderId}, Message: ${message}`);

  // Save the message to the centralized Messages collection
  const newMessage = await MassageSchema.create({
    senderId,
    message,
    isCompleted: false, // Default to false for new messages
  });

  // Respond with the created message
  res
    .status(201)
    .json(new ApiResponse(201, newMessage, "Message sent successfully"));
});

const getAllMessages = asyncHandler(async (req, res) => {
  // Fetch all messages from the database
  const messages = await MassageSchema.find()
    .populate("senderId", "username firstName lastName") // Populate sender details
    .sort({ createdAt: -1 }); // Sort by creation date, most recent first

  if (!messages || messages.length === 0) {
    throw new ApiError(404, "No messages found");
  }

  // Return all messages with sender details
  res
    .status(200)
    .json(new ApiResponse(200, messages, "Messages fetched successfully"));
});

export { sendMessage, getAllMessages };
