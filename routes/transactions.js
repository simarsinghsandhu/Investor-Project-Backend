const express = require("express")
const authenticateToken = require("../middleware/authMiddleware")
const { db } = require("../db/initDb")

const router = express.Router()

router.get("/transactions", authenticateToken, (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const offset = (page - 1) * limit

  db.get("SELECT COUNT(*) as count FROM transactions", (err, countResult) => {
    if (err) return res.status(500).json({ error: "Failed to retrieve count" })

    const total = countResult.count

    db.all(
      "SELECT id, date, amount, type, stock FROM transactions ORDER BY date DESC LIMIT ? OFFSET ?",
      [limit, offset],
      (err, rows) => {
        if (err)
          return res
            .status(500)
            .json({ error: "Failed to retrieve transactions" })
        res.json({ transactions: rows, total })
      }
    )
  })
})

module.exports = router
