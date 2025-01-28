import connectDb from '../../../config/db';
import Student from '../../../models/Student';

export default async function handler(req, res) {
    await connectDb();

    // Get All Students
    if (req.method === 'GET') {
        try {
            const students = await Student.find().sort({ student_index: 1 });
            res.status(200).json(students);
        } catch (err) {
            console.error('Error in getStudents:', err);
            res.status(500).json({
                error: 'Database error',
                details: err.message,
            });
        }
    }
    // Add Student
    else if (req.method === 'POST') {
        const { first_name, last_name, mail_id, address, phone } = req.body;

        if (!first_name || !last_name || !mail_id || !phone) {
            return res.status(400).json({
                error: 'Missing required fields',
                details: 'First name, last name, email, and phone are required',
            });
        }

        try {
            const newStudent = new Student({
                first_name,
                last_name,
                mail_id,
                address,
                phone,
            });
            const savedStudent = await newStudent.save();
            res.status(201).json({
                message: 'Student added successfully',
                student: savedStudent,
            });
        } catch (err) {
            console.error('Database error:', err);
            res.status(500).json({
                error: 'Server error',
                details: 'Failed to add student to the database',
            });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
