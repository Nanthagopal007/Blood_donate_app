const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
};

// Register user
const registerUser = async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    email,
    password: hashedPassword,
    role: role || "user",
  });

  const token = generateToken(newUser._id, newUser.role);
  res.status(201).json({ token, email: newUser.email, role: newUser.role });
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("Email not registered");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Incorrect password");
  }

  const token = generateToken(user._id, user.role);
  res.json({ token, email: user.email, role: user.role });
};

// Get current user
const currentUser = async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Unauthorized");
  }
  res.json(req.user);
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403);
    throw new Error("Access denied: Admins only");
  }
  const users = await User.find({}, "-password");
  res.json(users);
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403);
    throw new Error("Access denied: Admins only");
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json({ message: "User deleted successfully" });
};

// Role-based middleware
const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    res.status(403);
    throw new Error("Forbidden: Access denied");
  }
  next();
};

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  getAllUsers,
  deleteUser,
  authorizeRoles,
};
