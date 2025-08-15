const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// Middleware xác thực cho admin
const authMiddleware = (req, res, next) => {
  //console.log("req", req);
  const authHeader = req.headers.token;
  //console.log("AUTH", authHeader);
  if (!authHeader) {
    return res.status(401).json({
      status: "ERR",
      message: "Access token is missing",
    });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) {
      return res.status(401).json({
        status: "ERR",
        message: "Invalid or expired access token",
      });
    }

    // Kiểm tra quyền admin
    if (user?.isAdmin) {
      console.log("Admin authentication successful");
      req.user = user;
      next();
    } else {
      return res.status(403).json({
        status: "ERR",
        message: "You are not authorized to perform this action",
      });
    }
  });
};

// Middleware xác thực cho user lấy thông tin cá nhân
const authUserMiddleware = (req, res, next) => {
  const authHeader = req.headers.token;
  if (!authHeader) {
    return res.status(401).json({
      status: "ERR",
      message: "Access token is missing",
    });
  }

  const token = authHeader.split(" ")[1];
  const userId = req.params.id;

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: "ERR",
        message: "Invalid or expired access token",
      });
    }

    // Allow any authenticated user to perform the action
    // This includes adding comments, answers, and accessing their own resources
    if (decoded?.id) {
      req.user = decoded;
      console.log("User authentication successful, user ID:", decoded.id);
      next();
    } else {
      return res.status(403).json({
        status: "ERR",
        message: "Invalid user information in token",
      });
    }
  });
};

module.exports = {
  authMiddleware,
  authUserMiddleware,
};
