// import { Server } from "socket.io";
// import http from "http";
// import express from "express";

// const app = express();
// const server = http.createServer(app);

// // Create a mapping of userId -> socketId
// const userSocketMap = {}; // { userId: socketId }

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173", // Change this to match your frontend URL
//     credentials: true,
//   },
// });

// io.on("connection", (socket) => {
//   console.log("A user connected", socket.id);

//   const userId = socket.handshake.query.userId;
//   if (userId) {
//     userSocketMap[userId] = socket.id;
//   }

//   io.emit("getOnlineUsers", Object.keys(userSocketMap));

//   socket.on("disconnect", () => {
//     console.log("A user disconnected", socket.id);
//     if (userId) {
//       delete userSocketMap[userId];
//     }
//     io.emit("getOnlineUsers", Object.keys(userSocketMap));
//   });
// });

// // Function to get receiver's socketId by userId
// export function getreceiverSocketId(userId) {
//   return userSocketMap[userId];
// }

// export { io, app, server };
import { Server } from "socket.io";
import http from "http";
import express from "express";
const app = express();
const server = http.createServer(app);
const userSocketMap = {}; // { userId: socketId }
const io = new Server(server, {
  cors: { origin: "http://localhost:5174", credentials: true },
});
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    if (userId) delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});
export function getreceiverSocketId(userId) {
  return userSocketMap[userId];
}
export { io, app, server };