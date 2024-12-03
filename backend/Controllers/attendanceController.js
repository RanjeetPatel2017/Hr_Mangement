const Attendance = require('../Models/AttendanceModel');
const Employee = require('../Models/EmployeeModel');
const isWithinOfficeRadius = require('../Middleware/geofence');
const officeLocation = { lat: 23.259933, lng: 77.412615 }; // Set your office geolocation coordinates
const maxDistance = 0.5; // Define max allowed distance (e.g., 0.5 km)

exports.checkIn = async (req, res) => {
    try {
        const employeeId = req.user._id;
        console.log("employeeId",employeeId)
        const { geolocation } = req.body;
        console.log("Geolocation received: ", geolocation);


        // Geofencing check
        if (!isWithinOfficeRadius(geolocation, officeLocation, maxDistance)) {
            return res.status(400).json({ message: 'You are not within the allowed geofencing area.' });
        }

        // Mark check-in
        const attendance = new Attendance({
            employee: employeeId,
            checkInTime: new Date(),
            geolocation,
        });
        console.log("recieved", attendance)

        await attendance.save();
        res.status(200).json({ message: 'Check-in successful', attendance });
    } catch (error) {
        console.error('Error in check-in:', error.message, error.stack); // Enhanced error logging
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.checkOut = async (req, res) => {
    try {
        const employeeId = req.user._id;
        const { geolocation } = req.body;

        const attendance = await Attendance.findOne({ employee: employeeId, checkOutTime: null }).sort({ checkInTime: -1 });
        console.log('Fetched attendance record:', attendance);
        
        if (!attendance || !attendance.checkInTime) {
            return res.status(400).json({ message: 'No valid check-in record found for today.' });
        }

        if (!isWithinOfficeRadius(geolocation, officeLocation, maxDistance)) {
            return res.status(400).json({ message: 'You are not within the allowed geofencing area.' });
        }

        attendance.checkOutTime = new Date();

        const workTime = Math.abs(new Date(attendance.checkOutTime) - new Date(attendance.checkInTime));
        const hoursWorked = (workTime / (1000 * 60 * 60)).toFixed(2);
        attendance.totalHours = hoursWorked;
        await attendance.save();

        res.status(200).json({ message: 'Check-out successful', attendance });
    } catch (error) {
        console.error('Error during check-out:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};


exports.getAllAttendanceRecords = async (req, res) => {
    try {
        const records = await Attendance.find().populate('employee', 'name email');
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};