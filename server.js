// server.js (Node + Express + SQLite user auth API)
const express = require("express")
const sqlite3 = require("sqlite3").verbose()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const path = require("path")
const cors = require("cors")

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// SQLite setup
const dbPath = path.join(__dirname, "users.db")
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("DB connection error:", err)
  else console.log("Connected to SQLite DB ✅")
})

// Create users table if not exists
db.run(
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`
)

// Routes
app.get("/", (req, res) => {
  res.send("User Auth API (SQLite) is running 🚀")
})

// Register
app.post("/api/auth/register", async (req, res) => {
  const { email, password } = req.body
  if (!email || !password)
    return res.status(400).json({ error: "Missing fields" })

  const hashedPassword = await bcrypt.hash(password, 10)

  const stmt = db.prepare("INSERT INTO users (email, password) VALUES (?, ?)")
  stmt.run(email, hashedPassword, function (err) {
    if (err) {
      if (err.message.includes("UNIQUE")) {
        return res.status(400).json({ error: "Email already registered" })
      }
      return res.status(500).json({ error: "DB error" })
    }
    res.json({ message: "User registered", userId: this.lastID })
  })
})

// Login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body
  if (!email || !password)
    return res.status(400).json({ error: "Missing fields" })

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) return res.status(500).json({ error: "DB error" })
    if (!user) return res.status(400).json({ error: "Invalid credentials" })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ error: "Invalid credentials" })

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    )
    res.json({ token })
  })
})

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
)
