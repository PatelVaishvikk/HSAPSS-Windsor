const express = require('express');
const next = require('next');
const path = require('path');
const { testConnection } = require('./config/db'); // Assuming you have your DB connection in this file
const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

// Ensure database connection before starting server
async function startServer() {
    try {
        // Test database connection
        const isConnected = await testConnection();
        if (!isConnected) {
            console.error('❌ Cannot start server: Database connection failed');
            process.exit(1);
        }

        // Start the Next.js server
        app.prepare().then(() => {
            const server = express();

            // Custom routes or middleware
            server.get('/add-yuvak', (req, res) => {
                return res.sendFile(path.join(__dirname, 'public/add-yuvak.html'));
            });

            server.get('/students-table', (req, res) => {
                return res.sendFile(path.join(__dirname, 'public/students-table.html'));
            });

            server.get('/call-logs-table', (req, res) => {
                return res.sendFile(path.join(__dirname, 'public/call-logs-table.html'));
            });

            // Handle all other requests by Next.js
            server.all('*', (req, res) => {
                return handle(req, res);
            });

            // Start the server
            server.listen(PORT, (err) => {
                if (err) throw err;
                console.log(`✅ Server running on port ${PORT}`);
                console.log(`📊 Database connected successfully`);
            });
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
}

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('⚠️ Unhandled Promise Rejection:', err);
    process.exit(1);
});
