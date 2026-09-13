function authorizeRoles(...allowedRoles) {

    return function(req, res, next) {     
        if(!req.user){
            return res.status(401).json({
                message: "AUTHENTICATION REQUIRED!!!"
            })
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "ACCESS DENIED!!"
            });
        }

        next();
    };

}

module.exports = authorizeRoles;