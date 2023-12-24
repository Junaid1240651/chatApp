const ChatMessage = require("../models/Chat_Message");
const User = require("../models/user");
const { Op } = require("sequelize");
const multer = require("multer");
const { s3Uploadv2 } = require("../services/s3Service");

// Get chat messages based on the latest message ID and Group ID
exports.getChatMessage = async (req, res) => {
  const { latestMessageId, GroupId } = req.query;

  try {
    const messages = await ChatMessage.findAll({
      where: {
        id: { [Op.gt]: latestMessageId || 0 },
        GroupId: GroupId || null,
      },
      include: [{ model: User, attributes: ["name"] }],
      order: [["timestamp", "ASC"]],
    });

    // Format messages for response
    const formattedMessages = messages.map(
      ({ id, content, userId, timestamp, user, isImage }) => ({
        id,
        content,
        isImage,
        userId,
        timestamp,
        name: user.name,
      })
    );

    res.status(200).json(formattedMessages);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// Send a new chat message
exports.sendChatMessage = async (req, res) => {
  const { content, GroupId } = req.body;
  const userId = req.user.id;

  try {
    const newMessage = await ChatMessage.create({
      content,
      userId,
      GroupId: GroupId >= 0 ? GroupId : null,
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// Multer middleware for handling file uploads
const storage = multer.memoryStorage();

// ["image", "jpeg"]
// Configure multer for file uploads
const upload = multer({
  storage,
  limits: { fileSize: 1000000000, files: 2 },
});

// Middleware for handling multiple file uploads
exports.multerMiddleWare = upload.array("file");

// Save chat images to AWS S3 and store related data in the database
exports.saveChatImages = async (req, res) => {
  const userId = req.user.id;
  const groupId = req.body.groupId;

  try {
    // Upload images to AWS S3
    const results = await s3Uploadv2(req.files);
    const imageUrls = results.map((result) => result.Location);
    const fileType = getFileType(imageUrls[0]);

    // Create chat message data for image URLs
    const chatMessageData = {
      content: imageUrls[0],
      userId,
      isImage: fileType,
      GroupId: groupId >= 0 ? groupId : null,
    };

    // Store chat message data in the database
    await ChatMessage.create(chatMessageData);

    // Respond with success and image URLs
    return res.json({ status: "success", imageUrls });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error" });
  }
};

function getFileType(url) {
  const extension = url.split(".").pop().toLowerCase();

  if (["jpg", "jpeg", "png", "gif", "bmp"].includes(extension)) {
    return "image";
  } else if (["pdf"].includes(extension)) {
    return "pdf";
  } else if (["csv", "xlsx", "docx"].includes(extension)) {
    return "document";
  } else if (["mp4", "webm"].includes(extension)) {
    return "video";
  } else if (["mp3", "mp4a"].includes(extension)) {
    return "audio";
  } else if (["txt"].includes(extension)) {
    return "text";
  } else {
    return "unknown";
  }
}
