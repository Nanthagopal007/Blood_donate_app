const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// @desc Register a new user
// @route POST /api/users/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("All fields are required!");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const validRoles = ["user", "admin"];
    const assignedRole = validRoles.includes(role) ? role : "user"; 

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: assignedRole, 
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: `Bearer ${generateToken(user.id, user.role)}`,  // ✅ Ensure correct Bearer format
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});


const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error("❌ User not found, please register first!");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401);
      throw new Error("❌ Password is incorrect!");
    }

    res.json({
      message: "✅ Login successful!",
      role: user.role,
      token: "your-jwt-token-here"
    });

  } catch (err) {
    next(err); // handled by your errorHandler
  }
};

// @desc Delete a user (Admin Only)
// @route DELETE /api/users/:id
// @access Private (Admin)
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
});

// @desc Get current logged-in user
// @route GET /api/users/current
// @access Private
const currentUser = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});

// @desc Get all users (Admin Only)
// @route GET /api/users/all
// @access Private (Admin)
const getAllUsers = asyncHandler(async (req, res) => {
    if (!req.user || req.user.role !== "admin") {  // ✅ Safe check
        return res.status(403).json({ message: "Access Denied: Admins only!" });
    }

    try {
        const users = await User.find({}, "-password"); // Exclude password field
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

//generate token
const generateToken = (user) => {
    console.log("🔑 Secret Loaded:", process.env.ACCESS_TOKEN_SECRET);  // Check the secret value
    return jwt.sign(
        { id: user._id, role: user.role, email: user.email },
        process.env.ACCESS_TOKEN_SECRET,  // Secret loaded from .env
        { expiresIn: "1d" }
    );
};



// ✅ Middleware for Role-Based Access Control
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access Denied: Insufficient Role" });
        }
        next();
    };
};

// ✅ Export all functions
module.exports = { 
    registerUser, 
    loginUser, 
    deleteUser, 
    currentUser, 
    authorizeRoles, 
    getAllUsers 
};
