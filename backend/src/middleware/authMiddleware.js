const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "campuscare_secret_key";

const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "No token provided",
      });
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: "Invalid token",
      details: error.message,
    });
  }
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Access denied. Your role is not allowed to perform this action.",
        requiredRoles: allowedRoles,
        yourRole: req.user?.role,
      });
    }

    next();
  };
};

module.exports = authenticateUser;
module.exports.authorizeRoles = authorizeRoles;