const jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"

function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) return res.status(401).json({ error: "Token missing" })

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token invalid" })
    req.user = user
    next()
  })
}

module.exports = authenticateToken
