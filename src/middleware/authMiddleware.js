const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authAdminMiddleware = (req, res, next) => {
  const token = req.headers.token?.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err || !user?.isAdmin) {
      return res
        .status(403)
        .json({ status: "ERROR", message: "Forbidden (Admin only)" });
    }
    req.userId = user.id;
    req.role = "admin";
    next();
  });
};

// Middleware kiểm tra User hoặc Admin
const authUserMiddleware = (req, res, next) => {
  try {
    const token = req.headers.token?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ status: "ERROR", message: "Token is missing" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
      const userId = req.params.id;

      if (err) {
        console.log("❌ Token verify error:", err.message);
        return res
          .status(403)
          .json({ status: "ERROR", message: "Invalid token" });
      }

      const isAuthorized = user?.isAdmin || user?.id === userId;
      if (!isAuthorized) {
        console.log("⚠️ User unauthorized:", user);
        return res.status(403).json({ status: "ERROR", message: "Forbidden" });
      }

      req.userId = user.id;
      req.role = user.isAdmin ? "admin" : "user";
      next();
    });
  } catch (error) {
    console.error("Middleware error:", error);
    return res
      .status(500)
      .json({ status: "ERROR", message: "Internal server error" });
  }
};

module.exports = {
  authAdminMiddleware,
  authUserMiddleware,
};
