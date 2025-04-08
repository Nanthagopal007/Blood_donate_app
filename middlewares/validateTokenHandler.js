const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler"); // ✅ Import this!
const User = require("../models/userModel");

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader) {
        console.log("📢 Raw Authorization Header:", authHeader); // Debugging
        const parts = authHeader.split(" ");

        if (parts.length === 2 && parts[0] === "Bearer") {
            token = parts[1].trim();
        } else {
            console.error("🚨 Invalid Authorization Header Format");
            return res.status(401).json({ message: "Invalid token format" });
        }

        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            console.log("✅ Decoded Token:", decoded);

            if (!decoded.id) {  
                return res.status(401).json({ message: "Invalid token structure" }); // ✅ Fixed typo
            }

            req.user = await User.findById(decoded.id).select("-password");
            return next();
        } catch (err) {
            console.error("🚨 Token verification failed:", err.message);
            return res.status(401).json({ message: "User is not authorized" });
        }
    }

    console.error("🚨 Missing or invalid token.");
    return res.status(401).json({ message: "User is not authorized or token is missing" });
});

module.exports = validateToken;
