const express = require("express");

const router = express.Router();

const authenticateUser =
    require("../middlewares/authenticateUser");

const authorizeRoles =
    require("../middlewares/authorizeRoles");


const {
    generatePickupOTP,
    verifyPickupOTP,
    resendPickupOTP,
    invalidatePickupOTP
} = require("../controllers/otpController");


// ==========================================
// GENERATE OTP
// ==========================================

router.post(
    "/generate",
    authenticateUser,
    authorizeRoles("parent", "admin"),
    generatePickupOTP
);


// ==========================================
// VERIFY OTP
// ==========================================

// Only staff can verify OTP

router.post(
    "/verify",
    authenticateUser,
    authorizeRoles("staff"),
    verifyPickupOTP
);


// ==========================================
// RESEND OTP
// ==========================================

router.post(
    "/resend",
    authenticateUser,
    authorizeRoles("parent", "admin"),
    resendPickupOTP
);


// ==========================================
// INVALIDATE OTP
// ==========================================

router.post(
    "/invalidate",
    authenticateUser,
    authorizeRoles("parent", "admin"),
    invalidatePickupOTP
);


module.exports = router;