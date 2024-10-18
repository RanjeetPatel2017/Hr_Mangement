const express = require('express');
const EmployeeModel = require('../Models/EmployeeModel'); // Assuming EmployeeModel is in the Models folder
const router = express.Router();

// Approve or reject a leave request
router.post('/approve-leave', async (req, res) => {
    const { employeeId, leaveId, status } = req.body; // Status can be 'approved' or 'rejected'

    try {
        const employee = await EmployeeModel.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const leave = employee.leaves.id(leaveId);
        if (!leave) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        leave.status = status;
        await employee.save();

        res.json({ message: `Leave ${status} successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get employee details
router.get('/employee-details/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const employee = await EmployeeModel.findById(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
