const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt'); //New
const session = require('express-session');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
//New
app.use(session({
    secret: 'your-secret-key', // use a strong secret in production
    resave: false,
    saveUninitialized: true
}));

// Set up SQLite database
const dbPath = path.join(__dirname, 'Database', 'expense.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        // Create Expense table if it doesn't exist
        //New
        db.run(`CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
)`, (err) => {
    if (err) {
        console.error('Error creating Users table:', err.message);
    }
});
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
//New
app.post('/signup', (req, res) => {
    const { username, password } = req.body;

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err.message);
            return res.status(500).send('Internal server error');
        }

        db.run(`INSERT INTO Users (username, password) VALUES (?, ?)`, [username, hash], function (err) {
            if (err) {
                console.error('Error inserting user:', err.message);
                return res.status(400).send('Username already exists');
            }
            res.status(201).send('User registered successfully');
        });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT * FROM Users WHERE username = ?`, [username], (err, user) => {
        if (err) {
            console.error('Error retrieving user:', err.message);
            return res.status(500).send('Internal server error');
        }

        if (!user) {
            return res.status(401).send('User not found');
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.error('Error comparing passwords:', err.message);
                return res.status(500).send('Error during login');
            }

            if (result) {
                res.status(200).send('Login successful');
            } else {
                res.status(401).send('Incorrect password');
            }
        });
    });
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

