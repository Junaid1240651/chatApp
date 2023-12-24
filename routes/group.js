const express = require("express");
const groupRoutes = express.Router();
const { verifyToken } = require("../utils/jwtToken");
const group = require("../controllers/group");

groupRoutes.post("/createGroups", verifyToken, group.createGroup);
groupRoutes.post("/getGroups", verifyToken, group.getGroups);
groupRoutes.post("/editGroupName", verifyToken, group.editGroupName);

module.exports = groupRoutes;
