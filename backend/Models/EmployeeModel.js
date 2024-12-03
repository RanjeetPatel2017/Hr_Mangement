const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: {
        type: String, required: true, unique: true
    },
    mobile:{
        type: String,
        required: true
        
    },

    profileImage:{
        type: String
    },
    password: { 
        type: String, required: true 
    },

    role: { type: String, enum: ['HR', 'Employee'], default: 'Employee' }, // Assign roles to users
    basicSalary: { type: Number, default: 0 }, // Salary field
    deductions: {
        type: Number, 
        default: 0
    },
    bonuses: {
        type: Number,  
        default: 0
    },
    createdAt:{
        type: Date,
        default: new Date() 
    },
    overtimeHours: { type: Number, default: 0 }, // Overtime tracking field
    leaves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Leave' }], // Reference to the Leave model
    attendance: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attendance' }], // Reference to the Attendance model
});

// Password hashing middleware
employeeSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Password comparison method
employeeSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Employee', employeeSchema);
