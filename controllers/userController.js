const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// ✅ Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

// ✅ Register user
const registerUser = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // always lowercase email
    email = email.toLowerCase();

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user", // default role = user
    });

    // generate token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      token,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// ✅ Login user
const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // lowercase email
    email = email.toLowerCase();
    console.log("📩 Login attempt with:", email);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email not registered" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // generate token
    const token = generateToken(user._id, user.role);

    res.json({
      token,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// ✅ Get all users (Admin only)
const getAllUsers = async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }

  const users = await User.find({}, "-password"); // exclude password field
  res.json(users);
};


// ✅ Delete user (Admin only)
const deleteUser = async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ message: "User deleted successfully" });
};

// ✅ Role-based middleware
const authorizeRoles =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }
    next();
  };

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  deleteUser,
  authorizeRoles,
};
