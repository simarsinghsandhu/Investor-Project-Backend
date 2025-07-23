const sqlite3 = require("sqlite3").verbose()
const db = new sqlite3.Database("./db.sqlite")

function initializeDatabase() {
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
        date TEXT NOT NULL,
        amount REAL NOT NULL,
        type TEXT,
        stock TEXT
      )
    `)

    db.get("SELECT COUNT(*) as count FROM transactions", (err, row) => {
      if (err) return console.error("Error checking transaction count", err)

      if (row.count === 0) {
        const stmt = db.prepare(
          "INSERT INTO transactions (date, amount, type, stock) VALUES (?, ?, ?, ?)"
        )

        const stocks = ["AAPL", "TSLA", "GOOGL", "AMZN", "MSFT", "NFLX", "META"]

        for (let i = 0; i < 35; i++) {
          const date = new Date(Date.now() - i * 86400000).toISOString()
          const amount = (Math.random() * 100).toFixed(2)
          const type = Math.random() > 0.5 ? "deposit" : "withdraw"
          const stock = stocks[Math.floor(Math.random() * stocks.length)]
          stmt.run(date, amount, type, stock)
        }

        stmt.finalize()
        console.log("✅ Seeded 35 dummy transactions")
      }
    })

    db.run(`
      CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        url TEXT,
        created_at TEXT
      );
    `)

    db.get("SELECT COUNT(*) as count FROM reports", (err, row) => {
      if (err) return console.error("Error checking reports count", err)

      if (row.count === 0) {
        const reports = [
          ["Q2 2025 Report", "/pdfs/q2-2025.pdf", 0],
          ["Q1 2025 Report", "/pdfs/q1-2025.pdf", 30],
          ["Q4 2024 Report", "/pdfs/q4-2024.pdf", 90],
          ["Q3 2024 Report", "/pdfs/q3-2024.pdf", 150],
          ["Q2 2024 Report", "/pdfs/q2-2024.pdf", 210],
          ["Q1 2024 Report", "/pdfs/q1-2024.pdf", 270],
        ]

        const stmt = db.prepare(
          "INSERT INTO reports (name, url, created_at) VALUES (?, ?, ?)"
        )

        reports.forEach(([name, url, daysAgo]) => {
          const createdAt = new Date(
            Date.now() - daysAgo * 86400000
          ).toISOString()
          stmt.run(name, url, createdAt)
        })

        stmt.finalize()
        console.log("✅ Seeded 6 dummy reports")
      }
    })
  })
}

module.exports = { db, initializeDatabase }
