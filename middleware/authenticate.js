const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.get("authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    throw new Error("Unauthorized.");
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      next(err);
    }

    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
