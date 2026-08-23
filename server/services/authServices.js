const User = require("../models/user");
const bcrypt = require("bcrypt");

async function registerUser({ name, email, password, phone }) {

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        const error = new Error("Email already registered");
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        phone
    });

    return user;
}

module.exports = {
    registerUser
};