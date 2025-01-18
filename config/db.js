const { Pool } = require('pg');
require('dotenv').config();

let pool;

try {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        },
        max: 20, // Maximum number of clients in the pool
        idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
        connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
    });

    // Test the connection immediately
    pool.query('SELECT NOW()', (err, res) => {
        if (err) {
            console.error('❌ Initial database connection failed:', err.message);
        } else {
            console.log('✅ Initial database connection successful:', res.rows[0].now);
        }
    });

    // Error handling
    pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client:', err);
        process.exit(-1);
    });

    pool.on('connect', () => {
        console.log('New client connected to PostgreSQL');
    });

    pool.on('remove', () => {
        console.log('Client removed from pool');
    });

} catch (error) {
    console.error('Failed to create pool:', error);
    process.exit(-1);
}

// Export an async function to test connection
const testConnection = async () => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        client.release();
        console.log('Database connection test successful:', result.rows[0].now);
        return true;
    } catch (err) {
        console.error('Database connection test failed:', err.message);
        return false;
    }
};

module.exports = {
    pool,
    testConnection,
    query: (text, params) => pool.query(text, params)
};