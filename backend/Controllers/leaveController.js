const Leave = require('../Models/LeaveModel');

// Apply for Leave
exports.applyLeave = async (req, res) => {
    const { employeeId, leaveType, startDate, endDate } = req.body;

    try {
        const leave = new Leave({ employee: employeeId, leaveType, startDate, endDate });
        await leave.save();
        res.json({ message: 'Leave applied successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error applying for leave' });
    }
};

// Approve/Reject Leave
exports.updateLeaveStatus = async (req, res) => {
    const { leaveId, status } = req.body;

    try {
        const leave = await Leave.findById(leaveId);
        if (!leave) return res.status(404).json({ message: 'Leave not found' });

        leave.status = status;
        await leave.save();
        res.json({ message: `Leave ${status}` });
    } catch (error) {
        res.status(500).json({ message: 'Error updating leave status' });
    }
};
