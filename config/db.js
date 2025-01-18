// const { Pool } = require('pg');

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: process.env.NODE_ENV === 'production'
//     ? { rejectUnauthorized: false }   // for Render/Heroku with SSL
//     : false,                          // for local dev
// });

// module.exports = pool;

const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',           // Replace with your PostgreSQL username
  host: 'localhost',          // Replace with your host (localhost)
  database: 'HSAPSS_Windsor',     // Replace with your database name
  password: 'dasnadas',  // Replace with your PostgreSQL password
  port: 5432,                 // Default PostgreSQL port
});

module.exports = pool;
