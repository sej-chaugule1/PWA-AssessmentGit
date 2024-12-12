const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = new sqlite3.Database("./Database/expense.db", (err) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// Create the tasks table if it doesn't exist
db.run(
  `CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    Category TEXT NOT NULL,
    Amount INTEGER NOT NULL,
    Date TEXT NOT NULL,
  );`
);

// API Routes

// Get all tasks
app.get("/Expense", (req, res) => {
  db.all("SELECT * FROM Expense", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Get a single task by ID
app.get("/Expense/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM Expense WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(row);
    }
  });
});

// Add a new task
app.post("/Expense", (req, res) => {
  const { Category, Amount, Date } = req.body;
  if (!Category || !Amount || !Date) {
    return res.status(400).json({ error: "All fields are required." });
  }

  db.run(
    "INSERT INTO Expense (Category, Amount, Date) VALUES (?, ?, ?)",
    [Category, Amount, Date],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id: this.lastID });
      }
    }
  );
});

// Update a task
app.put("/Expense/:id", (req, res) => {
  const { id } = req.params;
  const { Category, Amount, Date } = req.body;

  if (!Category || !Amount || !Date) {
    return res.status(400).json({ error: "All fields are required." });
  }

  db.run(
    "UPDATE tasks SET Category = ?, Date = ?, Amount = ? WHERE id = ?",
    [Category, Amount, Date, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ changes: this.changes });
      }
    }
  );
});

// Delete a task
app.delete("/Expense/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM Expense WHERE id = ?", [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ changes: this.changes });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});