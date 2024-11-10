import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  signup,
  loginAdmin,
  getAllMessages,
  sendMessage,
} from "../controllers/admin.controller.js";

const router = Router();

router.route("/signup").post(signup);
router.route("/login").post(loginAdmin);
router.route("/Allmessage").get(getAllMessages);
router.route("/sendmessage").post(sendMessage);
// router.route("/messages/:userId").get(authMiddleware, getMessagesByUser);

export default router;
