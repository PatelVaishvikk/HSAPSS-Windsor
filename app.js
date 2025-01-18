const express = require('express');
const path = require('path');
const { pool, testConnection } = require('./config/db');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// HTML Routes
app.get('/add-yuvak', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/add-yuvak.html'));
});

app.get('/students-table', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/students-table.html'));
});

app.get('/call-logs-table', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/call-logs-table.html'));
});

// Test database connection on startup
(async () => {
    try {
        const isConnected = await testConnection();
        if (!isConnected) {
            console.error('Failed to connect to database on startup');
            process.exit(1);
        }
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
})();

// API Routes
const studentRoutes = require('./routes/StudentRoutes');
app.use('/api', studentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// Handle 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public/404.html'));
});

module.exports = app; 