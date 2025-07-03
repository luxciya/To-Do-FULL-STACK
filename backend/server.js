const http = require("http");
const app = require("./app");
const { setupSocket } = require("./services/socketService");

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

setupSocket(server); // ✅ attach socket.io to server

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


