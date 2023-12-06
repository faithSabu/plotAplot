const io = require("socket.io")(8000, {
  cors: {
    origin: "http://localhost:5173",
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  // add new user
  socket.on("new_user_add", (newUserId) => {
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
    } else {
      console.log("No user to send message", user);
    }
  });

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    io.emit("get_users", activeUsers);
    console.log("User disconnected");
  });
});
