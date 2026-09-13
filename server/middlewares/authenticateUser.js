
const jwt = require("jsonwebtoken");
const secret=process.env.JWT_SECRET
function authenticateUser(req, res, next) {

   const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({
            message:"AUTHENTICATION REQUIRED!!"
        })
    
    }

    const token =authHeader.split(" ")[1];                                                           [0]      [1]
    try {
       const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    }catch (error) {
        return res.status(401).json({
           message: "INVALID OR EXPIRED TOKEN!!"
        });
    }

}
module.exports = authenticateUser;