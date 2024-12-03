const Leave = require('../Models/LeaveModel');
const Employee = require('../Models/EmployeeModel');

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
    try {
      const leaveId = req.params.leaveId;
      const leave = await Leave.findById(leaveId);
      
      if (!leave) {
        return res.status(404).json({ message: 'Leave request not found' });
      }
  
      leave.status = 'approved';
      await leave.save();
  
      return res.status(200).json({ message: 'Leave approved successfully', data: leave });
    } catch (error) {
      return res.status(500).json({ message: 'Error approving leave', error: error.message });
    }
  };

exports.getPendingLeaves = async (req, res) => {
    try {
      // Fetch all leaves with status 'pending' and populate employee details
      const pendingLeaves = await Leave.find({ status: 'pending' }).populate('employee', 'name email'); // Populating only the necessary fields
  
      if (pendingLeaves.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No pending leave requests found',
        });
      }
  
      res.status(200).json({
        success: true,
        data: pendingLeaves,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Server error: ' + err.message,
      });
    }
  };
  // In leaveController.js
  exports.getEmployeeLeaves = async (req, res) => {
    try {
        const { employeeId } = req.query;
        if (!employeeId) {
            return res.status(400).json({ message: 'Employee ID is required' });
        }

        // Find all leave requests by the employee
        const leaves = await Leave.find({  employee: employeeId });

        if (leaves.length === 0) {
            return res.status(404).json({ message: 'No leaves found for this employee' });
        }

        res.status(200).json({ success: true, data: leaves });
    } catch (error) {
        console.error('Error fetching leaves:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
