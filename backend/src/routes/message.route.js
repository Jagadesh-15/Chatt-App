// import express from "express"
// import { protectRoute } from "../middleware/auth.middleware.js";
// import { getUsersForSidebar, getMessages ,sendMessages} from "../controllers/message.controller.js";
// const router = express.Router();

// router.get("/users",protectRoute, getUsersForSidebar);
// router.get("/:id",protectRoute, getMessages);

// router.post("/send/:id",protectRoute,sendMessages);





// export default router;
// routes/message.routes.js

import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUsersForSidebar,
  getMessages,
  sendMessages,
} from "../controllers/message.controller.js";

const router = express.Router();

// ✅ Get all users except current for sidebar
router.get("/users", protectRoute, getUsersForSidebar);

// ✅ Get chat messages between logged-in user and selected user
router.get("/:id", protectRoute, getMessages);

// ✅ Send a new message (text/image)
router.post("/send/:id", protectRoute, sendMessages);

export default router;
