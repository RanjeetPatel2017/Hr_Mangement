const express = require('express');
const Employee = require('../Models/EmployeeModel'); // Assuming Employee is a Mongoose model

const router = express.Router();

// Endpoint to search employees by name for suggestions
router.get('/employee-suggestions', async (req, res) => {
    try {
        const searchName = req.query.name;
        
        // If no search name is provided, return an error
        if (!searchName) {
            return res.status(400).json({ message: 'Employee name is required' });
        }

        // Use regex to perform case-insensitive partial matching on the name
        const employees = await Employee.find({
            name: { $regex: new RegExp(searchName, 'i') }
        }).select('name'); // Only return the employee name in suggestions

        // Return the list of matching employee names
        res.json(employees);
    } catch (error) {
        console.error('Error fetching employee suggestions:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/employee-details', async (req, res) => {
    try {
        const employeeName = req.query.name;

        // If no employee name is provided, return an error
        if (!employeeName) {
            return res.status(400).json({ message: 'Employee name is required' });
        }

        // Find the employee by name (case-insensitive)
        const employee = await Employee.findOne({ name: { $regex: new RegExp(employeeName, 'i') } });
        
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Return the found employee details
        res.json(employee);
    } catch (error) {
        console.error('Error fetching employee details:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/generate-payslip', async (req, res) => {
    try {
        const { employeeName, basicSalary, deductions, bonuses } = req.body;

        // Check if the data is being received correctly
        if (!employeeName || !basicSalary || !deductions || !bonuses) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Example payslip data logic (can be adapted to generate a PDF or other format)
        const totalSalary = basicSalary - deductions + bonuses;

        // Generate payslip (replace this with your actual generation logic)
        const payslipData = {
            employeeName,
            basicSalary,
            deductions,
            bonuses,
            totalSalary
        };

        // Send the generated payslip data
        res.status(200).json(payslipData);
    } catch (error) {
        console.error('Error generating payslip:', error);
        res.status(500).json({ message: 'Failed to generate payslip' });
    }
});




module.exports = router;
