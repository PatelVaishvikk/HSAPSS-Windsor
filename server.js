const app = require('./app');
const { testConnection } = require('./config/db');

const PORT = process.env.PORT || 3000;

// Ensure database connection before starting server
async function startServer() {
    try {
        // Test database connection
        const isConnected = await testConnection();
        if (!isConnected) {
            console.error('Cannot start server: Database connection failed');
            process.exit(1);
        }

        // Start server
        app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
            console.log(`📊 Database connected successfully`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    process.exit(1);
});