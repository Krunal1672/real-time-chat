import { useEffect, useState } from "react";
import socket from "./socket";

export default function App() {
  const [user, setUser] = useState("");
  const [joined, setJoined] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUser, setTypingUser] = useState("");

  useEffect(() => {
    socket.on("oldMessages", setMessages);
    socket.on("receiveMessage", msg =>
      setMessages(prev => [...prev, msg])
    );
    socket.on("usersUpdate", setUsers);
    socket.on("typing", user => {
      setTypingUser(user);
      setTimeout(() => setTypingUser(""), 1000);
    });
  }, []);

  const joinChat = () => {
    socket.emit("joinUser", user);
    setJoined(true);
  };

  const sendMessage = () => {
    if (!text.trim()) return;
    socket.emit("sendMessage", {
      user,
      text,
      createdAt: new Date()
    });
    setText("");
  };

  if (!joined) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0e1621]">
        <div className="bg-[#17212b] p-6 rounded text-white">
          <input
            className="p-2 bg-[#1f2c3a] rounded w-full"
            placeholder="Enter name"
            onChange={e => setUser(e.target.value)}
          />
          <button
            onClick={joinChat}
            className="mt-3 w-full bg-blue-600 p-2 rounded"
          >
            Join Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-[#0e1621] text-white">
      <div className="w-1/4 bg-[#17212b] p-4 hidden md:block">
        <h2 className="font-bold mb-3">Online</h2>
        {users.map((u, i) => (
          <div key={i} className="text-green-400">● {u}</div>
        ))}
      </div>

      <div className="flex flex-col flex-1">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`mb-2 p-2 rounded max-w-xs ${
                m.user === user
                  ? "ml-auto bg-[#3a6ea5]"
                  : "bg-[#2b5278]"
              }`}
            >
              <small className="opacity-70">{m.user}</small>
              <div>{m.text}</div>
            </div>
          ))}
          {typingUser && (
            <div className="text-sm opacity-70">
              {typingUser} is typing...
            </div>
          )}
        </div>

        <div className="p-3 bg-[#1f2c3a] flex">
          <input
            className="flex-1 p-2 rounded bg-[#17212b]"
            value={text}
            onChange={e => {
              setText(e.target.value);
              socket.emit("typing");
            }}
            placeholder="Message"
          />
          <button
            onClick={sendMessage}
            className="ml-2 bg-blue-600 px-4 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
