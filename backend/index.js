const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // For password hashing
const jwt = require('jsonwebtoken'); // For authentication
require('dotenv').config();
require('./Models/db'); // Connect to MongoDB
const {applyLeave , getPendingLeaves, updateLeaveStatus, getEmployeeLeaves} = require('./Controllers/leaveController');
const EmployeeRouter = require('./Routes/EmployeeRoutes');
const PayrollRouter = require('./Routes/PayerollRoutes');
const AuthRouter = require('./Routes/AuthRoutes'); // New auth routes for login, register
const HRActionsRouter = require('./Routes/HRActionsRoutes'); // New HR-specific routes
const Attendance = require('./Routes/attendance'); // New HR-specific routes

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Frontend URL
}));
app.use(bodyParser.json());

// Test Route
app.get('/', (req, res) => {
    res.send('Employee Management server is running');
});

// Routes
app.use('/api/auth', AuthRouter); // Authentication routes (login, register)
app.use('/api/employees', EmployeeRouter); // Employee routes (attendance, leave)
app.get('/api/leave/pending',getPendingLeaves ); // Employee routes (attendance, leave)
app.put('/api/leave/:leaveId/approve',updateLeaveStatus ); // Employee routes (attendance, leave)
app.put('/api/leave/:leaveId/reject', updateLeaveStatus); 
app.get('/api/leave/employee', getEmployeeLeaves);  // Authenticated route to get employee leaves

app.use('/api/payroll', PayrollRouter); // Payroll routes
app.use('/api/hr', HRActionsRouter); // HR routes (approve leave, manage payroll, etc.)
app.use('/api/attendance', Attendance); // HR routes (approve leave, manage payroll, etc.)
app.use('/api/leave/apply-leave', applyLeave);
// Server Initialization
app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});
