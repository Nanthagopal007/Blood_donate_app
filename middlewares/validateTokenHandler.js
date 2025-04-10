const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization;

    // Debugging the incoming Authorization header
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
            // Verify token using the secret stored in the environment variable
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            console.log("✅ Decoded Token:", decoded);

            // Validate that the decoded token has necessary properties (e.g., id)
            if (!decoded.id) {
                console.error("🚨 Token is missing 'id' in decoded structure");
                return res.status(401).json({ message: "Invalid token structure" });
            }

            // Attach the user data to the request object
            req.user = await User.findById(decoded.id).select("-password");

            // Proceed to next middleware or route handler
            return next();
        } catch (err) {
            console.error("🚨 Token verification failed:", err.message);
            return res.status(401).json({ message: "User is not authorized" });
        }
    }

    console.error("🚨 Missing or invalid token.");
    return res.status(401).json({ message: "Authorization header missing or token is invalid" });
});

module.exports = validateToken;
