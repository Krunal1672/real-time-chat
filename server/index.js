import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import connectDB from "./config/db.js";
import socketHandler from "./socket.js";

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: { origin: "*" }
});

connectDB();
socketHandler(io);

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
