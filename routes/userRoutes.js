const express = require("express");
const { registerUser, loginUser, currentUser, deleteUser, authorizeRoles, getAllUsers } = require("../controllers/userController"); 
const validateToken = require("../middlewares/validateTokenHandler");
const User = require("../models/userModel");


const router = express.Router();

// 🔓 Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// 🔒 Protected Routes (Ensure validateToken runs before authorizeRoles)
router.get("/current", validateToken, authorizeRoles("user", "admin"), currentUser);
router.delete("/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
});

// Example in Express.js (Backend)
router.get("/all", async (req, res) => {
    try {
        const users = await User.find({}, "-password"); // Exclude passwords for security
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
});


module.exports = router;
