const Employee = require('../Models/EmployeeModel');

exports.generatePayroll = async (req, res) => {
    const { employeeId, deductions, bonuses } = req.body;

    try {
        const employee = await Employee.findById(employeeId);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        const netPay = employee.basicSalary + bonuses - deductions + (employee.overtimeHours * overtimeRate);

        res.json({ employee: employee.name, netPay });
    } catch (error) {
        res.status(500).json({ message: 'Error generating payroll' });
    }
};
