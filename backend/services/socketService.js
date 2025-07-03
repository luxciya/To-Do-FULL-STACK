let io;

function setupSocket(server) {
  const { Server } = require("socket.io");
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log("Client connected: ", socket.id);

    socket.on("taskUpdated", () => {
      console.log("Broadcasting taskUpdated to all clients");
      io.emit("taskUpdated");
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected: ", socket.id);
    });
  });
}

module.exports = { setupSocket };
