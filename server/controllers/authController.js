const authService = require("../services/authServices");

async function registerUser(req, res) {

    try {

        const { name, email, password, phone } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const user = await authService.registerUser({
            name,
            email,
            password,
            phone
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {

        console.error(error);

        return res.status(error.statusCode || 500).json({
            message: error.message || "Server error"
        });
    }
}

module.exports = {
    registerUser
};