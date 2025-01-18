const express = require('express');
const router = express.Router();
const StudentModel = require('../models/StudentModel');

// Add student
router.post('/students', StudentModel.addStudent);

// Get all students
router.get('/students', StudentModel.getStudents);

// Update student
router.put('/students/edit/:id', StudentModel.updateStudent);

// Delete student
router.delete('/students/:id', StudentModel.deleteStudent);

// Log calls
router.post('/students/log-call', StudentModel.logCallsStudent);

// Get call logs
router.get('/students/call-logs/:studentId', StudentModel.getCallLogs);

// Get latest call logs
router.get('/students/call-logs-latest', StudentModel.getCallLogsLetest);

module.exports = router; 