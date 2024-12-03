const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee', // Assuming you have an Employee model
        required: [true, 'Employee is required'],
    },
    geolocation: {
        type:Object,
        required: true
    },
    
    checkInTime: {
        type: Date
    },
    checkOutTime: {
        type: Date
    }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
