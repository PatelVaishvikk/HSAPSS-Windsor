const express = require('express');
const router = express.Router();
const { addStudent, updateStudent, deleteStudent, getStudents } = require('../models/StudentModel');

// Add a student
router.post('/', async (req, res) => {
  try {
    await addStudent(req.body);
    res.redirect('/');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a student
router.put('/:id', async (req, res) => {
  try {
    await updateStudent(req.params.id, req.body);
    res.status(200).json({ message: 'Student updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a student
router.delete('/:id', async (req, res) => {
  try {
    await deleteStudent(req.params.id);
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all students
router.get('/', async (req, res) => {
  try {
    const result = await getStudents();
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
