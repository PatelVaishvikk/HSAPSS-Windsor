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
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM students WHERE student_index = $1', [id]);
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addStudent, getStudents, updateStudent, deleteStudent };
