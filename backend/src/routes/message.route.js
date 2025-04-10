import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUsersForSidebar,
  getMessages,
  sendMessages,
} from "../controllers/message.controller.js";

const router = express.Router();

// ✅ Route to get all users except current user (for sidebar display)
router.get("/users", protectRoute, getUsersForSidebar);

// ✅ Route to get all messages exchanged with a specific user
router.get("/:id", protectRoute, getMessages);

// ✅ Route to send a message (text/image) to a specific user
router.post("/send/:id", protectRoute, sendMessages);

export default router;
