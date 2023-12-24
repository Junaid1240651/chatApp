// models/Group.js
const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../utils/databaseConnection");

const Group = sequelize.define("Group", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  groupName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  groupMemberId: {
    type: Sequelize.JSON,
    allowNull: false, // Adjust as needed based on your requirements
  },
  createrId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Group;
