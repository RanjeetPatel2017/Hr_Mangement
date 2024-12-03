const express = require('express');
const router = express.Router();
const attendanceController = require('../Controllers/attendanceController');
const authMiddleware = require('../Middleware/authMiddleware');

// Employee check-in and check-out routes
router.post('/check-in', authMiddleware.verifyEmployee, attendanceController.checkIn);
router.post('/check-out', authMiddleware.verifyEmployee, attendanceController.checkOut);

// HR to view attendance records
router.get('/', attendanceController.getAllAttendanceRecords);

module.exports = router;
