const express = require("express");
const {
  registerUser,
  loginUser,
  // currentUser,
  deleteUser,
  authorizeRoles,
  getAllUsers,
} = require("../controllers/userController");
const validateToken = require("../middlewares/validateTokenHandler");

const router = express.Router();

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected
// router.get("/current", validateToken, currentUser);
router.get("/all", validateToken, authorizeRoles("admin"), getAllUsers);
router.delete("/:id", validateToken, authorizeRoles("admin"), deleteUser);

module.exports = router;
