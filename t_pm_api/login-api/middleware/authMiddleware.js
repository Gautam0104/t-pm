// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
require('dotenv').config();

const SESSION_EXPIRATION = 15 * 60 * 1000; // 15 minute

const sessionTracker = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized access.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token expired. Please log in again.' });

        const currentTime = Date.now();
        const lastActivity = user.lastActivity || 0;

        if (currentTime - lastActivity > SESSION_EXPIRATION) {
            const query = 'INSERT INTO session_logs (user_id, reason) VALUES (?, ?)';
            db.query(query, [user.id, 'Session expired'], (err) => {
                if (err) console.error('Failed to log session:', err);
            });
            return res.status(401).json({ message: 'Session expired. Please log in again.' });
        }

        user.lastActivity = currentTime; // Update last activity timestamp
        req.user = user;
        next();
    });
};

module.exports = sessionTracker;


