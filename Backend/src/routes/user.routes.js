import { Router } from "express";
import {
  signup,
  loginUser,
  sendMessage,
  getAllMessages,
} from "../controllers/customer.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/signup").post(signup);
router.route("/login").post(loginUser);
router.route("/sendmessage").post(authMiddleware, sendMessage);
router.route("/Allmessage").get(authMiddleware, getAllMessages);
export default router;
