const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the User Schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['HR', 'Employee'], // Define the possible roles
        required: true,
    },
});

// Middleware to hash password before saving user


// Method to compare hashed password


// Create User model from the schema
const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
