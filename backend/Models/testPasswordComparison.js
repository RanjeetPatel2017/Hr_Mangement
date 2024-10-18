const bcrypt = require('bcrypt');

const testPasswordHashing = async () => {
    const plainTextPassword = 'Raja@2023'; // The password you used to register
    const hashedPassword = '$2b$10$CKSTHJQlQY/W7NR/6NtIauvM67oqqD66qUInjuXOxtBGyeH.NhYD2'; // Replace this with the actual hashed password from your DB

    // Hash the plain text password
    const newHashedPassword = await bcrypt.hash(plainTextPassword, 10);
    console.log('Newly hashed password:', newHashedPassword);

    // Compare newly hashed password with the stored hashed password
    const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
    console.log('Password comparison result:', isMatch); // This should print true if both passwords match
};

testPasswordHashing();
