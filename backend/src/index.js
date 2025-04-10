import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import path from "path";

dotenv.config();
const PORT = process.env.PORT || 5002;
const __dirname = path.resolve();

// Middleware
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// CORS config
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/chatt/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend/chatt/dist", "index.html"));
  });
}

// Start server
server.listen(PORT, () => {
  console.log("Server is running on PORT: " + PORT);
  connectDB();
});
