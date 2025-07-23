const express = require("express")
const cors = require("cors")
const sqlite3 = require("sqlite3").verbose()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 5000
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"

app.use(cors())
app.use(express.json())

const db = new sqlite3.Database("./db.sqlite")

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      amount REAL
    )
  `)

  // Check if already has data
  db.get("SELECT COUNT(*) as count FROM transactions", (err, row) => {
    if (row.count === 0) {
      const stmt = db.prepare(
        "INSERT INTO transactions (date, amount) VALUES (?, ?)"
      )
      for (let i = 0; i < 35; i++) {
        const date = new Date(Date.now() - i * 86400000).toISOString() // past 35 days
        const amount = (Math.random() * 100).toFixed(2)
        stmt.run(date, amount)
      }
      stmt.finalize()
      console.log("Seeded 35 dummy transactions")
    }
  })
})

// --- Middleware to protect routes ---
function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) return res.status(401).json({ error: "Token missing" })

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token invalid" })
    req.user = user
    next()
  })
}

// --- Auth Routes ---
app.post("/register", (req, res) => {
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

app.post("/login", (req, res) => {
  const { email, password } = req.body
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Invalid credentials" })
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET)
    res.json({ token })
  })
})

// --- Transactions Route ---
app.get("/transactions", authenticateToken, (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const offset = (page - 1) * limit

  // First, get total count
  db.get("SELECT COUNT(*) as count FROM transactions", (err, countResult) => {
    if (err) {
      return res.status(500).json({ error: "Failed to retrieve count" })
    }

    const total = countResult.count

    // Then fetch paginated results
    db.all(
      "SELECT id, date, amount FROM transactions ORDER BY date DESC LIMIT ? OFFSET ?",
      [limit, offset],
      (err, rows) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Failed to retrieve transactions" })
        }
        res.json({ transactions: rows, total })
      }
    )
  })
})

app.get("/", (req, res) => {
  res.send("User Auth API is running 🚀")
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
