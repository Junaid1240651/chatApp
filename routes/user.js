const express = require("express");
const userRoutes = express.Router();
const { verifyToken } = require("../utils/jwtToken");

const user = require("../controllers/user");
// userRoutes.post("/", verifyToken, user.verifyUser);
userRoutes.post("/signup", user.signup);
userRoutes.post("/login", user.login);
userRoutes.get("/allUser", verifyToken, user.allUser);
userRoutes.post("/", verifyToken, user.verifyUser);

module.exports = userRoutes;
