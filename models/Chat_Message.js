const { DataTypes } = require("sequelize");
const sequelize = require("../utils/databaseConnection");

const Chat_Message = sequelize.define("chat_Message", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  content: {
    // Renamed from 'message' to 'content' for clarity
    type: DataTypes.STRING,
    allowNull: false,
  },
  isImage: {
    type: DataTypes.STRING,
    defaultValue: false,
  },
  userId: {
    type: DataTypes.INTEGER, // Assuming user identification is a string (e.g., username)
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Chat_Message;
