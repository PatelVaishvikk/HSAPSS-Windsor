const express = require('express');
const router = express.Router();
const path = require('path');
const pool = require('../config/db');
const {
  addStudent,
  getStudents,
  updateStudent,
  deleteStudent,
  logCallsStudent,
  getCallLogs,
  getCallLogsLetest,
  getStudent,
} = require('../models/StudentModel');

// View Routes (put these first)
router.get('/students-table', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/students-table.html'));
});

router.get('/call-logs-table', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/call-logs-table.html'));
});

// Call Log Routes (put these before student routes with IDs)
router.get('/call-logs/latest', async (req, res) => {
    try {
        console.log('Starting call logs fetch...');
        
        // Test database connection
        const testQuery = await pool.query('SELECT NOW()');
        console.log('Database connection OK');
        
        const result = await pool.query(`
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
        
        console.log('Query executed successfully');
        console.log('Found logs:', result.rows.length);
        res.json(result.rows || []);
    } catch (err) {
        console.error('Detailed error:', {
            message: err.message,
            stack: err.stack,
            code: err.code
        });
        res.status(500).json({ 
            error: 'Failed to fetch call logs',
            details: err.message 
        });
    }
});
router.get('/call-logs/:studentId', getCallLogs);
router.post('/call-logs', async (req, res) => {
    try {
        console.log('Received call log request:', req.body); // Debug log

        const {
            student_id,
            status,
            notes,
            needs_follow_up,
            follow_up_date
        } = req.body;

        // Validate required fields
        if (!student_id || !status) {
            return res.status(400).json({
                error: 'Missing required fields',
                details: 'Student ID and status are required'
            });
        }

        // Insert call log
        const result = await pool.query(`
            INSERT INTO call_logs 
            (student_id, status, notes, needs_follow_up, follow_up_date)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [student_id, status, notes, needs_follow_up, follow_up_date]
        );

        console.log('Call log saved:', result.rows[0]); // Debug log
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error saving call log:', err);
        res.status(500).json({ 
            error: 'Failed to save call log',
            details: err.message 
        });
    }
});

// Student Routes
router.post('/students', addStudent);
router.get('/students', getStudents);
router.get('/students/:id', getStudent);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

// Add this route for testing
router.get('/call-logs/test', (req, res) => {
    res.json({ status: 'API is working' });
});

// Add this debug route
router.get('/debug/call-logs', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM call_logs');
        res.json({
            count: result.rows.length,
            data: result.rows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add this test route
router.post('/debug/add-test-log', async (req, res) => {
    try {
        // First get a valid student_id
        const studentResult = await pool.query('SELECT student_index FROM students LIMIT 1');
        if (studentResult.rows.length === 0) {
            return res.status(404).json({ error: 'No students found' });
        }

        const student_id = studentResult.rows[0].student_index;
        
        // Insert a test call log
        const result = await pool.query(`
            INSERT INTO call_logs 
            (student_id, status, notes, needs_follow_up, follow_up_date, created_at)
            VALUES 
            ($1, 'completed', 'Test call log', false, NULL, CURRENT_TIMESTAMP)
            RETURNING *
        `, [student_id]);

        res.json({
            message: 'Test call log added',
            data: result.rows[0]
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add this new route
router.get('/statistics', async (req, res) => {
    try {
        // Get total students
        const studentsResult = await pool.query('SELECT COUNT(*) FROM students');
        const totalStudents = parseInt(studentsResult.rows[0].count);

        // Get today's calls
        const todayCallsResult = await pool.query(`
            SELECT COUNT(*) FROM call_logs 
            WHERE DATE(created_at) = CURRENT_DATE
        `);
        const todayCalls = parseInt(todayCallsResult.rows[0].count);

        // Get follow-ups due
        const followUpsResult = await pool.query(`
            SELECT COUNT(*) FROM call_logs 
            WHERE needs_follow_up = true 
            AND follow_up_date <= CURRENT_DATE
        `);
        const followUpsDue = parseInt(followUpsResult.rows[0].count);

        // Get call status distribution
        const statusResult = await pool.query(`
            SELECT status, COUNT(*) 
            FROM call_logs 
            GROUP BY status
        `);
        
        const statusCounts = {
            completed: 0,
            'no-answer': 0,
            voicemail: 0,
            'wrong-number': 0,
            disconnected: 0
        };

        statusResult.rows.forEach(row => {
            statusCounts[row.status] = parseInt(row.count);
        });

        // Calculate success rate
        const totalCalls = Object.values(statusCounts).reduce((a, b) => a + b, 0);
        const successRate = totalCalls > 0 
            ? Math.round((statusCounts.completed / totalCalls) * 100) 
            : 0;

        // Get weekly trends
        const weeklyTrendsResult = await pool.query(`
            SELECT 
                DATE(created_at) as call_date,
                COUNT(*) as call_count
            FROM call_logs
            WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
            GROUP BY DATE(created_at)
            ORDER BY call_date
        `);

        // Format dates for the last 7 days
        const last7Days = Array.from({length: 7}, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        const weeklyTrends = {
            labels: last7Days.map(date => new Date(date).toLocaleDateString()),
            data: last7Days.map(date => {
                const found = weeklyTrendsResult.rows.find(row => 
                    new Date(row.call_date).toISOString().split('T')[0] === date
                );
                return found ? parseInt(found.call_count) : 0;
            })
        };

        res.json({
            totalStudents,
            todayCalls,
            followUpsDue,
            successRate,
            callStatusDistribution: [
                statusCounts.completed || 0,
                statusCounts['no-answer'] || 0,
                statusCounts.voicemail || 0,
                statusCounts['wrong-number'] || 0,
                statusCounts.disconnected || 0
            ],
            weeklyTrends
        });
    } catch (err) {
        console.error('Error fetching statistics:', err);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// Add this test route
router.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT COUNT(*) FROM call_logs');
        res.json({
            success: true,
            count: result.rows[0].count
        });
    } catch (err) {
        console.error('Database test error:', err);
        res.status(500).json({ error: 'Database test failed' });
    }
});

// Add this near your other test routes
router.get('/test-connection', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({
            success: true,
            timestamp: result.rows[0].now,
            message: 'Database connection successful'
        });
    } catch (err) {
        console.error('Database connection test error:', err);
        res.status(500).json({
            error: 'Database connection failed',
            details: err.message
        });
    }
});

// Add this route to insert test data
router.post('/debug/add-test-logs', async (req, res) => {
    try {
        // Get all student IDs
        const students = await pool.query('SELECT student_index FROM students');
        if (students.rows.length === 0) {
            return res.status(404).json({ error: 'No students found' });
        }

        // Sample statuses
        const statuses = ['completed', 'no-answer', 'voicemail', 'wrong-number', 'disconnected'];
        
        // Insert test logs for each student
        const promises = students.rows.map(async (student) => {
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            return pool.query(`
                INSERT INTO call_logs 
                (student_id, status, notes, needs_follow_up, follow_up_date, created_at)
                VALUES 
                ($1, $2, $3, $4, $5, NOW())
                RETURNING *
            `, [
                student.student_index,
                status,
                'Test call log for ' + status,
                Math.random() > 0.5,
                Math.random() > 0.5 ? new Date(Date.now() + 86400000) : null
            ]);
        });

        await Promise.all(promises);
        res.json({ message: 'Test call logs added successfully' });
    } catch (err) {
        console.error('Error adding test logs:', err);
        res.status(500).json({ error: err.message });
    }
});

// Add this route for deleting call logs
router.delete('/call-logs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // First check if the log exists
        const checkResult = await pool.query(
            'SELECT * FROM call_logs WHERE id = $1',
            [id]
        );
        
        if (checkResult.rows.length === 0) {
            return res.status(404).json({
                error: 'Call log not found',
                details: 'The specified call log does not exist'
            });
        }

        // Delete the log
        await pool.query(
            'DELETE FROM call_logs WHERE id = $1',
            [id]
        );

        res.json({ 
            success: true,
            message: 'Call log deleted successfully'
        });
    } catch (err) {
        console.error('Error deleting call log:', err);
        res.status(500).json({ 
            error: 'Failed to delete call log',
            details: err.message 
        });
    }
});

module.exports = router;
