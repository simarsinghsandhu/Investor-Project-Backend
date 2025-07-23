const express = require("express")
const cors = require("cors")
require("dotenv").config()

const { initializeDatabase } = require("./db/initDb")
const authRoutes = require("./routes/auth")
const transactionRoutes = require("./routes/transactions")

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

initializeDatabase() // ✅ Set up DB

// ✅ Register routes
app.use("/api", authRoutes)
app.use("/api", transactionRoutes)

app.get("/", (req, res) => {
  res.send("User Auth API is running 🚀")
})

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`)
})
