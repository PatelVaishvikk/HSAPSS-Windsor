const pool = require('../config/db');

// Add a student
const addStudent = async (req, res) => {
    const { first_name, last_name, mail_id, address, phone } = data;
    await pool.query(
      'INSERT INTO students (first_name, last_name, mail_id, address, phone) VALUES ($1, $2, $3, $4, $5)',
      [first_name, last_name, mail_id, address, phone]
    );
};


const getStudents = async (req, res) => {
    const result = await pool.query('SELECT * FROM students ORDER BY student_index');
    return result.rows;
};

module.exports = { addStudent, getStudents };
