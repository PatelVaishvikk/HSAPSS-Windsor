// const express = require('express');
// const router = express.Router();
// const { addStudent, updateStudent, deleteStudent, getStudents } = require('../models/StudentModel');

// // Add a student
// router.post('/students', async (req, res) => {
//   try {
//     await addStudent(req.body);
//     res.redirect('/');
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Update a student
// router.put('/:student_index', async (req, res) => {
//   try {
//     await updateStudent(req.params.student_index, req.body);
//     res.status(200).json({ message: 'Student updated successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Delete a student
// router.delete('/:student_index', async (req, res) => {
//   try {
//     await deleteStudent(req.params.student_index);
//     res.status(200).json({ message: 'Student deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get all students
// router.get('/students', async (req, res) => {
//   try {
//     const result = await getStudents();
//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const { addStudent, getStudents, updateStudent, deleteStudent } = require('../models/StudentModel');

// Route to add a new student
router.post('/students', addStudent);

// Route to get all students
router.get('/students', getStudents);

// Route to edit/update a student's information
router.put('/students/edit/:id', updateStudent);

// Route to delete a student
router.delete('/students/delete/:id', deleteStudent);

module.exports = router;
