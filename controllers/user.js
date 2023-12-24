// Handle user signup
const bcrypt = require("bcrypt");
const User = require("../models/user"); // Assuming you have a User model
const { Op } = require("sequelize");
const { generateToken } = require("../utils/jwtToken"); // Assuming you have a function to generate JWT tokens

exports.signup = async (req, res) => {
  const { name, email, password, number } = req.body;

  try {
    // Check if the user with the provided email or number already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email: email }, { number: number }],
      },
    });

    if (!existingUser) {
      // Encrypt the password using bcrypt
      const encryptedPassword = await bcrypt.hash(password, 10);

      // Create a new user record
      const newUser = await User.create({
        name: name,
        email: email,
        number: number,
        password: encryptedPassword,
      });

      // Generate a JWT token for the user
      const token = generateToken(newUser);

      // Send the token and user details in the response
      res.status(201).json({ token, user: newUser });
    } else {
      // If the user already exists, send a 409 status and message (Conflict)
      res.status(409).send("User already exists. Please login.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user with the provided email
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (user) {
      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        // If the passwords match, generate a JWT token
        const token = generateToken(user);

        // Send the token and user details in the response
        res.status(200).json({ token, user });
      } else {
        // If the passwords don't match, send a 401 status and message
        res.status(401).send("Invalid password");
      }
    } else {
      // If the user doesn't exist, send a 401 status and message
      res.status(401).send("User does not exist. Please sign up.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.allUser = async (req, res) => {
  try {
    const response = await User.findAll();
    const filter = response.filter((data) => data.id !== req.user.id);
    // console.log(filter);
    res.send(filter);
  } catch (error) {
    console.log(error);
  }
};
// Verify user using the JWT middleware
exports.verifyUser = async (req, res) => {
  // Send the verified user details in the response
  res.status(201).send("User Authanticate verified");
};
