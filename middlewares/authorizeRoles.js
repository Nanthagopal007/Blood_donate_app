const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        console.log(`🔍 Checking Role: ${req.user?.role}`); // Debugging

        if (!req.user || !allowedRoles.includes(req.user.role)) {
            console.error("🚨 Access Denied. User Role:", req.user?.role);
            return res.status(403).json({ message: "Access Denied: Insufficient Role" });
        }

        next();
    };
};

module.exports = authorizeRoles;
