import Message from "./models/Message.js";

let users = [];

const socketHandler = (io) => {
  io.on("connection", (socket) => {

    socket.on("joinUser", async (username) => {
      socket.username = username;
      users.push(username);

      const messages = await Message.find().sort({ createdAt: 1 });
      socket.emit("oldMessages", messages);

      io.emit("usersUpdate", users);
      io.emit("receiveMessage", {
        user: "System",
        text: `${username} joined the chat`,
        createdAt: new Date()
      });
    });

    socket.on("typing", () => {
      socket.broadcast.emit("typing", socket.username);
    });

    socket.on("sendMessage", async (data) => {
      const message = new Message(data);
      await message.save();
      io.emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
      users = users.filter(u => u !== socket.username);
      io.emit("usersUpdate", users);
    });
  });
};

export default socketHandler;
