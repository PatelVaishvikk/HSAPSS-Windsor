import mongoose from 'mongoose';

const connectDb = async () => {
    if (mongoose.connection.readyState >= 1) {
        console.log('Already connected to MongoDB');
        return;
    }

    const dbUri = process.env.MONGODB_URI || 'your-mongo-db-connection-string';

    try {
        await mongoose.connect(dbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw new Error('Failed to connect to MongoDB');
    }
};

export default connectDb;
