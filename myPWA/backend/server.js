const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Set up SQLite database
const dbPath = path.join(__dirname, 'Database', 'expense.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        // Create Expense table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS Expense (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            Category TEXT,
            Amount INTEGER,
            Date TEXT
        )`, (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            }
        });
    }
});

app.get('/api/Expense', (req, res) => {
    const { sortBy } = req.query;

    let query = 'SELECT * FROM Expense';
    if (sortBy) {
        const validColumns = ['Date', 'Category', 'Amount']; // Allowed columns for sorting
        if (validColumns.includes(sortBy)) {
            query += ` ORDER BY ${sortBy}`;
        } else {
            return res.status(400).send('Invalid sort parameter');
        }
    }

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error retrieving data:', err.message);
            res.status(500).send('Error retrieving data');
        } else {
            res.status(200).json(rows);
        }
    });
});

// Get all expenses
app.get('/api/Expense', (req, res) => {
    db.all('SELECT * FROM Expense', [], (err, rows) => {
        if (err) {
            console.error('Error retrieving data:', err.message);
            res.status(500).send('Error retrieving data');
        } else {
            res.status(200).json(rows);
        }
    });
});

// Get a single expense by ID
app.get('/api/Expense/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM Expense WHERE id = ?', [id], (err, row) => {
        if (err) {
            console.error('Error retrieving data:', err.message);
            res.status(500).send('Error retrieving data');
        } else if (!row) {
            res.status(404).send('Expense not found');
        } else {
            res.status(200).json(row);
        }
    });
});

// Create a new expense
app.post('/api/Expense', (req, res) => {
    const { Category, Date, Amount } = req.body;
    db.run(`INSERT INTO Expense (Category, Amount, Date) VALUES (?, ?, ?)`,
        [Category, Amount, Date],
        function (err) {
            if (err) {
                console.error('Error inserting data:', err.message);
                res.status(500).send('Error inserting data');
            } else {
                res.status(201).json({ id: this.lastID });
            }
        });
});

// Update an existing expense
app.put('/api/Expense/:id', (req, res) => {
    const { id } = req.params;
    const { Category, Date, Amount } = req.body;
    db.run(`UPDATE Expense SET Category = ?, Amount = ?, Date = ? WHERE id = ?`,
        [Category, Amount, Date, id],
        function (err) {
            if (err) {
                console.error('Error updating data:', err.message);
                res.status(500).send('Error updating data');
            } else {
                res.status(200).send('Updated successfully');
            }
        });
});

// Delete an expense
app.delete('/api/Expense/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM Expense WHERE id = ?`, id, function (err) {
        if (err) {
            console.error('Error deleting data:', err.message);
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

