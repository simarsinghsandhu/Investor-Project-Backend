const express = require("express")
const authenticateToken = require("../middleware/authMiddleware")
const router = express.Router()
const { db } = require("../db/initDb")

router.get("/reports", authenticateToken, (req, res) => {
  db.all(
    "SELECT name, url, created_at FROM reports ORDER BY created_at DESC",
    (err, rows) => {
      if (err) {
        console.error("Error fetching reports:", err)
        return res.status(500).json({ error: "Failed to retrieve reports" })
      }
      res.json({ reports: rows })
    }
  )
})

module.exports = router
