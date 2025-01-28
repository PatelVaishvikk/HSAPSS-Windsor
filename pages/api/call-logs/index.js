import connectDb from '../../../config/db';  // Import the database connection function
import CallLog from '../../../models/CallLog'; // Import the Mongoose model for CallLog

export default async function handler(req, res) {
    // Ensure the connection to MongoDB is established before handling the request
    await connectDb();

    // Handle POST requests (for creating new call logs)
    if (req.method === 'POST') {
        const { student_id, status, notes, needs_follow_up, follow_up_date } = req.body;

        // Validate that the required fields are present in the request body
        if (!student_id || !status) {
            return res.status(400).json({
                error: 'Missing required fields',
                details: 'Student ID and status are required',
            });
        }

        try {
            // Create a new CallLog instance with the provided data
            const newCallLog = new CallLog({
                student_id,
                status,
                notes,
                needs_follow_up,
                follow_up_date,
            });

            // Save the new call log to the database
            const savedCallLog = await newCallLog.save();

            // Respond with the saved call log data
            res.status(201).json({
                message: 'Call log created successfully',
                callLog: savedCallLog,
            });
        } catch (error) {
            console.error('Error saving call log:', error);
            res.status(500).json({
                error: 'Server error',
                details: error.message,
            });
        }
    } else {
        // If the request method is not POST, return a 405 (Method Not Allowed) error
        res.status(405).json({
            error: 'Method Not Allowed',
            details: 'Only POST requests are allowed',
        });
    }
}
