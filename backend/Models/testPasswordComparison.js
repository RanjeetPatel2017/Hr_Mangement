const bcrypt = require('bcrypt');

const testPasswordHashing = async () => {
    const plainTextPassword = 'Sara@2023'; // The password you used to register
    const hashedPassword = '$2b$10$jgxIFgMn7B5Omtxa7s/I9.Zn81xKXW0ouXhGBKGtAAok9/odAksXm'; // Replace this with the actual hashed password from your DB

    // Hash the plain text password
    const newHashedPassword = await bcrypt.hash(plainTextPassword, 10);
    console.log('Newly hashed password:', newHashedPassword);

    // Compare newly hashed password with the stored hashed password
    const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
    console.log('Password comparison result:', isMatch); // This should print true if both passwords match
};

testPasswordHashing();
