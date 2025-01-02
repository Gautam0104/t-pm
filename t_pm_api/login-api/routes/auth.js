// routes/auth.js

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
require('dotenv').config();

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(query, [username, hashedPassword], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error.', details: err });
        res.status(201).json({ message: 'User registered successfully.' });
    });
});

// Login user and generate JWT
const SESSION_EXPIRATION = 15 * 60 * 1000; // 15 minute
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error.', details: err });

        if (results.length === 0 || !(await bcrypt.compare(password, results[0].password))) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const user = results[0];
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: '15m' // Token expires in 15 minutes
        });

        res.json({
             message: 'Login successful.',
              token, 
              expiresAt: Date.now() + SESSION_EXPIRATION,
            });
    });
});

module.exports = router;
