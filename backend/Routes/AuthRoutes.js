const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../Models/UserModel'); // Assuming UserModel is in the Models folder
const router = express.Router();

// Register a new user (HR or Employee)
router.post('/register', async (req, res) => {
    const { email, password, role } = req.body; // Role should be 'HR' or 'Employee'

    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({
            email,
            password: hashedPassword,
            role,
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error); // Log error for debugging
        res.status(500).json({ message: 'Server error' });
    }
});

// Login a user
// Login a user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid email or password.' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid email or password.' });
        }

        // Generate JWT token
        const token = jwt.sign({ _id: user._id, role: user.role,empId:user.employee }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send response with token and role
        return res.json({ success: true, token, role: user.role, _id: user._id,empId:user.employee});
    } catch (err) {
        console.error('Server error:', err);
        return res.status(500).json({ success: false, message: 'Server error, please try again later.' });
    }
});


module.exports = router;
