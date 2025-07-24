const express = require("express")
const authenticateToken = require("../middleware/authMiddleware")
const { db } = require("../db/initDb")

const router = express.Router()

router.get("/portfolio", authenticateToken, (req, res) => {
  const userId = req.user.id

  // Get user info
  db.get("SELECT id, email FROM users WHERE id = ?", [userId], (err, user) => {
    if (err || !user) {
      return res.status(500).json({ error: "Failed to get user info" })
    }

    // Get all transactions
    db.all(
      "SELECT stock, amount, type FROM transactions",
      (err, transactions) => {
        if (err) {
          return res.status(500).json({ error: "Failed to get transactions" })
        }

        const summary = {}
        let totalInvestment = 0

        transactions.forEach((tx) => {
          const stock = tx.stock
          const amount = parseFloat(tx.amount)

          if (!summary[stock]) {
            summary[stock] = 0
          }

          if (tx.type === "deposit") {
            summary[stock] += amount
            totalInvestment += amount
          } else if (tx.type === "withdraw") {
            summary[stock] -= amount
            totalInvestment -= amount
          }
        })

        res.json({
          user: {
            id: user.id,
            email: user.email,
          },
          summary,
          totalInvestment: parseFloat(totalInvestment.toFixed(2)),
        })
      }
    )
  })
})

module.exports = router
