const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'HSAPSS_Windsor',
  password: 'dasnadas',
  port: 5432,
});

module.exports = pool;
