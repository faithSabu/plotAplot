const http = require("http");
const socketIO = require("socket.io");

const httpServer = http.createServer();

const io = socketIO(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://plot-a-plot.lyricbee.online",
      "http://www.plot-a-plot.lyricbee.online",
      "https://plot-a-plot.lyricbee.online",
      "https://www.plot-a-plot.lyricbee.online",
    ],
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  // add new user
  socket.on("new_user_add", (newUserId) => {
    console.info(newUserId, "newUserId");

    const existingUser = activeUsers.find((user) => user.userId === newUserId);
    if (existingUser) {
      existingUser.socketId = socket.id;
    } else {
      activeUsers.push({
        userId: newUserId,
        socketId: socket.id,
      });
    }
    io.emit("get_users", activeUsers);
  });

  // send message
  socket.on("send_messages", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);

    if (user) {
      io.to(user.socketId).emit("receive_messge", data);
    }
  });

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    io.emit("get_users", activeUsers);
    console.info("User disconnected");
  });
});

const PORT = 8000;
httpServer.listen(PORT, () => {
  console.info(`Socket server listening on port ${PORT}`);
});
