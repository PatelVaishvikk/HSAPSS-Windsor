const { query } = require('../config/db');

// Add a student
const addStudent = async (req, res) => {
    const { first_name, last_name, mail_id, address, phone } = req.body;
    
    // Validate required fields
    if (!first_name || !last_name || !mail_id || !phone) {
        return res.status(400).json({ 
            error: 'Missing required fields',
            details: 'First name, last name, email, and phone are required'
        });
    }

    try {
        const result = await query(
            'INSERT INTO students (first_name, last_name, mail_id, address, phone) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [first_name, last_name, mail_id, address, phone]
        );
        
        res.status(201).json({
            message: 'Student added successfully',
            student: result.rows[0]
        });
    } catch (err) {
        if (err.code === '23505') {
            res.status(400).json({ 
                error: 'Duplicate entry',
                details: 'A student with this phone number already exists'
            });
        } else {
            console.error('Database error:', err);
            res.status(500).json({ 
                error: 'Server error',
                details: 'Failed to add student to database'
            });
        }
    }
};

// Get all students
const getStudents = async (req, res) => {
    try {
        const result = await query('SELECT * FROM students ORDER BY student_index');
        res.json(result.rows);
    } catch (err) {
        console.error('Error in getStudents:', err);
        res.status(500).json({ 
            error: 'Database error',
            details: err.message 
        });
    }
};

// Update a student's information
const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, mail_id, address, phone } = req.body;
  try {
    await query(
      'UPDATE students SET first_name = $1, last_name = $2, mail_id = $3, address = $4, phone = $5 WHERE student_index = $6',
      [first_name, last_name, mail_id, address, phone, id]
    );
    res.json({ message: 'Student updated successfully' });
  } catch (err) {
    if (err.code === '23505') {
      res.status(400).json({ error: 'Duplicate entry: First name and phone must be unique' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

// Delete a student
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM students WHERE student_index = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
};


const logCallsStudent = async (req, res) => {
    try {
        const {
            student_id,
            status,
            notes,
            needs_follow_up,
            follow_up_date
        } = req.body;

        console.log('Received call log data:', req.body); // Debug log

        if (!student_id || !status) {
            return res.status(400).json({
                error: 'Missing required fields',
                details: 'Student ID and status are required'
            });
        }

        const result = await query(
            `INSERT INTO call_logs 
            (student_id, status, notes, needs_follow_up, follow_up_date)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [student_id, status, notes, needs_follow_up, follow_up_date]
        );

        console.log('Call log saved:', result.rows[0]); // Debug log
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error in logCallsStudent:', err);
        res.status(500).json({ 
            error: 'Server error',
            details: err.message 
        });
    }
};

const getCallLogs = async (req, res) => {
    try {
        const { studentId } = req.params;
        const result = await query(
            `SELECT 
                cl.*,
                s.first_name,
                s.last_name
            FROM call_logs cl
            LEFT JOIN students s ON cl.student_id = s.student_index
            WHERE cl.student_id = $1 
            ORDER BY cl.created_at DESC`,
            [studentId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const getCallLogsLetest = async (req, res) => {
    try {
        console.log('Starting getCallLogsLetest...');

        const result = await query(`
            SELECT 
                cl.id,
                cl.student_id,
                cl.status,
                cl.notes,
                cl.needs_follow_up,
                cl.follow_up_date,
                cl.created_at,
                s.first_name,
                s.last_name
            FROM call_logs cl
            LEFT JOIN students s ON cl.student_id = s.student_index
            ORDER BY cl.created_at DESC
        `);

        console.log('Found call logs:', result.rows.length);
        
        // Send empty array if no results
        res.json(result.rows || []);
    } catch (err) {
        console.error('Error in getCallLogsLetest:', err);
        res.status(500).json({ 
            error: 'Server error',
            details: err.message
        });
    }
};

// Add this new function to get a single student
const getStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query(
            'SELECT * FROM students WHERE student_index = $1',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { addStudent, getStudents, getStudent, updateStudent, deleteStudent, logCallsStudent, getCallLogs, getCallLogsLetest };