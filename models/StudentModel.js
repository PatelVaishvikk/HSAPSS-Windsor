// const pool = require('../config/db');

// // Add a student
// const addStudent = async (req, res) => {
//   const { first_name, last_name, mail_id, address, phone } = req.body;
//   try {
//     const result = await pool.query(
//       'INSERT INTO students (first_name, last_name, mail_id, address, phone) VALUES ($1, $2, $3, $4, $5) RETURNING *',
//       [first_name, last_name, mail_id, address, phone]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     if (err.code === '23505') {
//       res.status(400).json({ error: 'Duplicate entry: Email or phone already exists' });
//     } else {
//       throw err;
//     }
//   }
// };

// // Get all students
// const getStudents = async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM students ORDER BY student_index');
//     res.json(result.rows);
//   } catch (err) {
//     throw err;
//   }
// };

// // Update a student's information
// const updateStudent = async (req, res) => {
//   const { id } = req.params;
//   const { first_name, last_name, mail_id, address, phone } = req.body;
//   try {
//     const result = await pool.query(
//       'UPDATE students SET first_name = $1, last_name = $2, mail_id = $3, address = $4, phone = $5 WHERE student_index = $6 RETURNING *',
//       [first_name, last_name, mail_id, address, phone, id]
//     );
    
//     if (result.rows.length === 0) {
//       res.status(404).json({ error: 'Student not found' });
//     } else {
//       res.json(result.rows[0]);
//     }
//   } catch (err) {
//     if (err.code === '23505') {
//       res.status(400).json({ error: 'Duplicate entry: Email or phone already exists' });
//     } else {
//       throw err;
//     }
//   }
// };

// // Delete a student
// const deleteStudent = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const result = await pool.query(
//       'DELETE FROM students WHERE student_index = $1 RETURNING *',
//       [id]
//     );
    
//     if (result.rows.length === 0) {
//       res.status(404).json({ error: 'Student not found' });
//     } else {
//       res.json({ message: 'Student deleted successfully' });
//     }
//   } catch (err) {
//     throw err;
//   }
// };

// // Fetch students for DataTable (server-side processing)
// const fetchStudentsForDataTable = async (start, length, searchValue, orderColumn, orderDirection) => {
//   try {
//     // Validate order column to prevent SQL injection
//     const validColumns = ['student_index', 'first_name', 'last_name', 'mail_id', 'phone', 'address'];
//     if (!validColumns.includes(orderColumn)) {
//       orderColumn = 'student_index';
//     }

//     // Total records
//     const totalRecordsResult = await pool.query('SELECT COUNT(*) FROM students');
//     const totalRecords = parseInt(totalRecordsResult.rows[0].count);

//     // Build search condition
//     const searchCondition = searchValue ? 
//       'WHERE first_name ILIKE $1 OR last_name ILIKE $1 OR mail_id ILIKE $1 OR phone ILIKE $1 OR address ILIKE $1' :
//       '';
//     const searchParam = searchValue ? [`%${searchValue}%`] : [];

//     // Total filtered records
//     const filteredQuery = `
//       SELECT COUNT(*) FROM students 
//       ${searchCondition}
//     `;
//     const totalFilteredResult = await pool.query(filteredQuery, searchParam);
//     const totalFiltered = parseInt(totalFilteredResult.rows[0].count);

//     // Data query
//     const dataQuery = `
//       SELECT * FROM students 
//       ${searchCondition}
//       ORDER BY ${orderColumn} ${orderDirection}
//       LIMIT $${searchParam.length + 1} OFFSET $${searchParam.length + 2}
//     `;
//     const dataParams = [...searchParam, length, start];
//     const dataResult = await pool.query(dataQuery, dataParams);

//     return {
//       totalRecords,
//       totalFiltered,
//       data: dataResult.rows
//     };
//   } catch (error) {
//     throw error;
//   }
// };

// module.exports = {
//   addStudent,
//   getStudents,
//   updateStudent,
//   deleteStudent,
//   fetchStudentsForDataTable
// };


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