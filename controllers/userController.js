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

// @desc Login user
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are required!");
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: `Bearer ${generateToken(user.id, user.role)}`,  // ✅ Ensure correct Bearer format
        });
    } else {
        res.status(401);
        throw new Error("Invalid credentials");
    }
});

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

// // ✅ Generate JWT Token with Role
// const generateToken = (userId, role) => {
//     return jwt.sign(
//         { id: userId, role }, 
//         process.env.ACCESS_TOKEN_SECRET,
//         { expiresIn: "1d" }
//     );
// };
// ✅ Generate JWT Token with Role (Fixed with safety check)

const generateToken = (userId, role) => {
    const secret = process.env.ACCESS_TOKEN_SECRET;

    if (!secret) {
        console.error("🚨 ACCESS_TOKEN_SECRET is missing from environment variables.");
        throw new Error("Internal server error: Token secret not configured.");
    }

    return jwt.sign(
        { id: userId, role },
        secret,
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
