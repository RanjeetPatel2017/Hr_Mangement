const Employee = require('../Models/EmployeeModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Login Controller
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const employee = await Employee.findOne({ email });
        if (!employee) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: employee._id, role: employee.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, employee });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Register Employee
exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const employee = new Employee({ name, email, password, role });
        await employee.save();
        res.json({ message: 'Employee registered successfully' });
    } catch (error) {
        console.error("Registration error:", error); 
        res.status(500).json({ message: 'Server error' });
    }
};
