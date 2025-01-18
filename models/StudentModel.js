

const pool = require('../config/db');

// Add a student
const addStudent = async (req, res) => {
  const { first_name, last_name, mail_id, address, phone } = req.body;
  try {
    await pool.query(
      'INSERT INTO students (first_name, last_name, mail_id, address, phone) VALUES ($1, $2, $3, $4, $5)',
      [first_name, last_name, mail_id, address, phone]
    );
    res.redirect('/');
  } catch (err) {
    if (err.code === '23505') {
      res.status(400).json({ error: 'Duplicate entry: First name and phone must be unique' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

// Get all students
const getStudents = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students ORDER BY student_index');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a student's information
const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, mail_id, address, phone } = req.body;
  try {
    await pool.query(
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
    await pool.query('DELETE FROM students WHERE student_index = $1', [id]);
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
        call_status,
        notes,
        needs_follow_up,
        follow_up_date
    } = req.body;

    const result = await pool.query(
        `INSERT INTO call_logs 
        (student_id, call_status, notes, needs_follow_up, follow_up_date)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [student_id, call_status, notes, needs_follow_up, follow_up_date]
    );

    res.json(result.rows[0]);
} catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
}
};

const getCallLogs = async (req, res) => {
  try {
    const { studentId } = req.params;
    const result = await pool.query(
        `SELECT * FROM call_logs 
        WHERE student_id = $1 
        ORDER BY timestamp DESC`,
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
    const result = await pool.query(
        `SELECT DISTINCT ON (student_id) 
            student_id, 
            call_status, 
            timestamp,
            needs_follow_up,
            follow_up_date
        FROM call_logs 
        ORDER BY student_id, timestamp DESC`
    );

    res.json(result.rows);
} catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
}

}





module.exports = { addStudent, getStudents, updateStudent, deleteStudent, logCallsStudent, getCallLogs, getCallLogsLetest };