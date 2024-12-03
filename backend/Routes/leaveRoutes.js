const { getPendingLeaves } = require('../Controllers/leaveController');
const LeaveModel = require('../Models/LeaveModel');
const routes = require('./EmployeeRoutes');

routes.get('/leave/pending', getPendingLeaves);