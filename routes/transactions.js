const express = require("express")
const authenticateToken = require("../middleware/authMiddleware")
const { db } = require("../db/initDb")

const router = express.Router()

// Get paginated transactions
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
        if (err) {
          console.error("Database error:", err)
          return res
            .status(500)
            .json({ error: "Failed to retrieve transactions" })
        }
        res.json({ transactions: rows, total })
      }
    )
  })
})

// Create a new transaction
router.post("/transactions", authenticateToken, (req, res) => {
  const { date, amount, type, stock } = req.body

  if (!date || !amount || !type || !stock) {
    return res.status(400).json({ error: "Missing fields" })
  }

  const stmt = db.prepare(
    "INSERT INTO transactions (date, amount, type, stock) VALUES (?, ?, ?, ?)"
  )

  stmt.run(date, amount, type, stock, function (err) {
    if (err) {
      console.error(err)
      return res.status(500).json({ error: "Failed to add transaction" })
    }

    res.status(201).json({ id: this.lastID, date, amount, type, stock })
  })

  stmt.finalize()
})

// Update an existing transaction
router.put("/transactions/:id", authenticateToken, (req, res) => {
  const { id } = req.params
  const { date, amount, type, stock } = req.body

  if (!date || !amount || !type || !stock) {
    return res.status(400).json({ error: "Missing fields" })
  }

  db.run(
    "UPDATE transactions SET date = ?, amount = ?, type = ?, stock = ? WHERE id = ?",
    [date, amount, type, stock, id],
    function (err) {
      if (err) {
        console.error(err)
        return res.status(500).json({ error: "Failed to update transaction" })
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Transaction not found" })
      }

      res.json({ id, date, amount, type, stock })
    }
  )
})

// Delete a transaction
router.delete("/transactions/:id", authenticateToken, (req, res) => {
  const { id } = req.params

  db.run("DELETE FROM transactions WHERE id = ?", [id], function (err) {
    if (err) {
      console.error(err)
      return res.status(500).json({ error: "Failed to delete transaction" })
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Transaction not found" })
    }

    res.json({ message: "Transaction deleted", id })
  })
})

module.exports = router
