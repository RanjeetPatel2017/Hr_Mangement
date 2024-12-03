const jwt = require('jsonwebtoken');
const Employee = require('../Models/EmployeeModel');
require('dotenv').config();

exports.verifyEmployee = async (req, res, next) => {

    const token = req.headers.authorization?.split(' ')[1]; // Extract token
    console.log('Token received:', token); // Log token for debugging

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded); 
    
      const employee = await Employee.findById(decoded.empId); // Ensure 'id' matches the payload field in token
      if (!employee) {
        return res.status(401).json({ message: 'Unauthorized: Employee not found' });
      }
    
      req.user = employee;
      console.log('success') // Attach employee data to request
      next(); 
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Unauthorized: Token has expired' });
      }
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
      }
      console.error('Token verification error:', error); 
      return res.status(401).json({ message: 'Unauthorized: Token verification failed' });
    }
    
};

  exports.verifyHR = (req, res, next) => {
    const role = req.user.role;
    if (role !== 'HR') {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
  exports.getRole = (req, res, next) => {
 
    if (!req.user || req.user.role !== 'HR') {
        return res.status(403).json({ message: 'Access denied: HRs only' });
    }
    next();
};

  