const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");
const secret="my-secret";
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

async function loginUser({email,password}){
    
        const user= await User.findOne({email});
        if(!user){
            const error = new Error("INVALID CREDENTIALS!!!");
            error.statusCode = 401;
            throw error;
        }
        
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            const error = new Error("INVALID CREDENTIALS!!!");
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign(
        {
                userId: user._id.toString(),
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        );
        return {
            user,
            token
        };
    
}

module.exports = {
    registerUser,
    loginUser
};