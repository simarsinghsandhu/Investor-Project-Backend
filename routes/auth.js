const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { db } = require("../db/initDb")

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"

router.post("/register", (req, res) => {
  const { email, password } = req.body
  const hash = bcrypt.hashSync(password, 8)
  db.run(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, hash],
    function (err) {
      if (err) return res.status(400).json({ error: "Email already exists" })
      const token = jwt.sign({ id: this.lastID }, JWT_SECRET)
      res.json({ token })
    }
  )
})

router.post("/login", (req, res) => {
  const { email, password } = req.body
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Invalid credentials" })
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET)
    res.json({ token })
  })
})

module.exports = router
