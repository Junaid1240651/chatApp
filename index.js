require("dotenv").config();

// Importing necessary modules
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "PATCH"],
    credentials: true,
  })
);

// Importing application routes
const groupRoutes = require("./routes/group");
const userRoutes = require("./routes/user");
const chatMessageRoutes = require("./routes/chat_Message");

app.use(userRoutes);
app.use(chatMessageRoutes);
app.use(groupRoutes);

const sequelize = require("./utils/databaseConnection");
const User = require("./models/user");
const Group = require("./models/group");
const ChatMessage = require("./models/Chat_Message");

User.hasMany(ChatMessage);
ChatMessage.belongsTo(User);

Group.hasMany(ChatMessage);
ChatMessage.belongsTo(Group);

// Synchronize the database with the defined models
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database synchronized");
  })
  .catch((err) => {
    console.error("Error synchronizing database:", err);
  });
io.on("connection", (socket) => {
  console.log("A user connected");

  // Listen for the "groupId" event from the client
  socket.on("groupId", (groupId) => {
    console.log(`Received groupCreated: ${groupId}`);

    // Broadcast the groupId to all connected clients
    socket.broadcast.emit("groupId", groupId);
  });
  socket.on("groupCreated", (groupCreated) => {
    console.log(`Received groupCreated: ${groupCreated}`);

    // Broadcast the groupId to all connected clients
    socket.broadcast.emit("groupCreated", groupCreated);
  });
  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
app.set("socketio", io);
// Start the server and listen on the specified port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
