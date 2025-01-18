const express = require('express');
const router = express.Router();
const {
  addStudent,
  getStudents,
  updateStudent,
  deleteStudent,
  logCallsStudent,
  getCallLogs,
  getCallLogsLetest,
} = require('../models/StudentModel');

// Routes for Students
router.post('/students', addStudent); // Add a new student
router.get('/students', getStudents); // Get all students
router.put('/students/edit/:id', updateStudent); // Edit/update a student
router.delete('/students/:id', deleteStudent); // Delete a student

// Routes for Call Logs
router.post('/api/call-logs', logCallsStudent); // Log a call
router.get('/api/call-logs/:studentId', getCallLogs); // Get call history for a student
router.get('/api/call-logs/status/latest', getCallLogsLetest); // Get the latest call status for all students

module.exports = router;
