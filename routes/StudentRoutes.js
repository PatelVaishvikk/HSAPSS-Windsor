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