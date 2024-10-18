const jwt = require('jsonwebtoken');
const Employee = require('../Models/EmployeeModel');
exports.verifyEmployee = async (req, res, next) => {
  try {
      const token = req.headers.authorization?.split(' ')[1]; // Extract the token from the Authorization header
      if (!token) {
          return res.status(401).json({ message: 'Unauthorized: No token provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const employee = await Employee.findById(decoded.id); // Find the employee by decoded token ID

      if (!employee) {
          return res.status(401).json({ message: 'Unauthorized: Employee not found' });
      }

      req.user = employee; // Attach the employee to the request object
      next();
  } catch (error) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token', error });
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

  