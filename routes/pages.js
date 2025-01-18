const express = require('express');
const router = express.Router();
const path = require('path');

// Serve the main page (index.html)
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Serve the add-yuvak page
router.get('/add-yuvak', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/add-yuvak.html'));
});

module.exports = router; 