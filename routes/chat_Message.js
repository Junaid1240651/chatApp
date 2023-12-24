const express = require("express");
const chatRoutes = express.Router();
const { verifyToken } = require("../utils/jwtToken");

const chatMessage = require("../controllers/chatMessage");
chatRoutes.post("/chat", verifyToken, chatMessage.sendChatMessage);
chatRoutes.get("/chat", verifyToken, chatMessage.getChatMessage);
chatRoutes.get("/groupchat", verifyToken, chatMessage.getChatMessage);
chatRoutes.post(
  "/saveChatImages",
  chatMessage.multerMiddleWare,
  verifyToken,
  chatMessage.saveChatImages
);

module.exports = chatRoutes;
