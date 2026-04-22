const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "wastewise_secret_2024";

// Middleware: verify JWT token and attach user to req
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "No token provided. Access denied." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { id, role, name, email }
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: "Invalid or expired token." });
    }
};

// Middleware: restrict to specific roles
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Not authenticated." });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: `Access denied. Requires role: ${roles.join(" or ")}.` });
        }
        next();
    };
};

module.exports = { authMiddleware, requireRole };
