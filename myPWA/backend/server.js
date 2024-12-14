const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Set up SQLite database
const path = require('path');
const dbPath = path.join(__dirname, 'Database', 'expense.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        db.run(`CREATE TABLE IF NOT EXISTS Expense (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            Category TEXT,
            Amount INTEGER,
            Date TEXT,
        )`);
    }
});

// Get a single study session by ID
app.get('/api/Expense/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM Expense WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).send('Error retrieving data');
        } else if (!row) {
            res.status(404).send('Study session not found');
        } else {
            res.status(200).json(row);
        }
    });
});

// Create a new study session
app.post('/api/Expense', (req, res) => {
    const { Category, Date, Amount } = req.body;
    db.run(`INSERT INTO Expense (Category, Amount, Date) VALUES (?, ?, ?)`,
        [Category, Date, Amount],
        function (err) {
            if (err) {
                res.status(500).send('Error inserting data');
            } else {
                res.status(201).json({ id: this.lastID });
            }
        });
});

// Get all study sessions
app.get('/api/Expense', (req, res) => {
    db.all('SELECT * FROM Expense', [], (err, rows) => {
        if (err) {
            res.status(500).send('Error retrieving data');
        } else {
            res.status(200).json(rows);
        }
    });
});


// Delete a study session
app.delete('/api/Expense/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM Expense WHERE id = ?`, id, function (err) {
        if (err) {
            res.status(500).send('Error deleting data');
        } else {
            res.status(200).send('Deleted successfully');
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
// Update a study session
app.put('/api/Expense/:id', (req, res) => {
    const { id } = req.params;
    const { Category, Date, Amount } = req.body;
    db.run(`UPDATE Expense SET Category = ?, Amount = ?, Date = ? WHERE id = ?`,
        [Category, Amount, Date, id],
        function (err) {
            if (err) {
                res.status(500).send('Error updating data');
            } else {
                res.status(200).send('Updated successfully');
            }
        });
});
