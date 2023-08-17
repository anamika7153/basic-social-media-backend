const jwt = require('jsonwebtoken');
JWT_SECRET = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Token verification failed"); // Add this line
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
