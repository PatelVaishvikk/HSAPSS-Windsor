// const path = require('path');
// const express = require('express');
// const studentRoutes = require('./routes/StudentRoutes');
// require('dotenv').config();

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
//   });
// // Routes
// app.use('/', studentRoutes);

// // Start the server
// const PORT = process.env.PORT | 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

const express = require('express');
const path = require('path');
const studentRoutes = require('./routes/StudentRoutes');

const app = express();

// Serve static files for npm packages
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.use('/', studentRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});