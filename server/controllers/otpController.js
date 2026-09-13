const otpService = require("../services/otpServices");


// ==========================================
// GENERATE OTP
// ==========================================

async function generatePickupOTP(req, res) {

    try {

        const { pickupRequestId } = req.body;

        if (!pickupRequestId) {

            return res.status(400).json({
                message: "PICKUP REQUEST ID IS REQUIRED"
            });
        }


        const request =
            await otpService.generatePickupOTP(
                pickupRequestId,
                req.user.userId,
                req.user.role
            );


        return res.status(200).json({

            message: "OTP GENERATED SUCCESSFULLY",

            request: {
                id: request._id,
                status: request.status,
                otp: request.otp,
                otpExpiresAt: request.otpExpiresAt
            }
        });

    } catch (error) {

        console.error(error);

        return res.status(
            error.statusCode || 500
        ).json({

            message:
                error.message ||
                "SERVER ERROR"
        });
    }
}


// ==========================================
// VERIFY OTP
// ==========================================

async function verifyPickupOTP(req, res) {

    try {

        const {
            pickupRequestId,
            otp
        } = req.body;


        if (!pickupRequestId || !otp) {

            return res.status(400).json({

                message:
                    "PICKUP REQUEST ID AND OTP ARE REQUIRED"
            });
        }


        const handover =
            await otpService.verifyPickupOTP(

                pickupRequestId,

                otp,

                req.user.userId
            );


        return res.status(201).json({

            message:
                "OTP VERIFIED AND HANDOVER COMPLETED",

            handover
        });

    } catch (error) {

        console.error(error);

        return res.status(
            error.statusCode || 500
        ).json({

            message:
                error.message ||
                "SERVER ERROR"
        });
    }
}


// ==========================================
// RESEND OTP
// ==========================================

async function resendPickupOTP(req, res) {

    try {

        const { pickupRequestId } = req.body;


        if (!pickupRequestId) {

            return res.status(400).json({

                message:
                    "PICKUP REQUEST ID IS REQUIRED"
            });
        }


        const request =
            await otpService.resendPickupOTP(

                pickupRequestId,

                req.user.userId,

                req.user.role
            );


        return res.status(200).json({

            message:
                "OTP RESENT SUCCESSFULLY",

            request: {
                id: request._id,
                status: request.status,
                otp: request.otp,
                otpExpiresAt: request.otpExpiresAt
            }
        });

    } catch (error) {

        console.error(error);

        return res.status(
            error.statusCode || 500
        ).json({

            message:
                error.message ||
                "SERVER ERROR"
        });
    }
}


// ==========================================
// INVALIDATE OTP
// ==========================================

async function invalidatePickupOTP(req, res) {

    try {

        const { pickupRequestId } = req.body;


        if (!pickupRequestId) {

            return res.status(400).json({

                message:
                    "PICKUP REQUEST ID IS REQUIRED"
            });
        }


        const request =
            await otpService.invalidatePickupOTP(

                pickupRequestId,

                req.user.userId,

                req.user.role
            );


        return res.status(200).json({

            message:
                "OTP INVALIDATED SUCCESSFULLY",

            request: {
                id: request._id,
                status: request.status,
                otp: request.otp,
                otpExpiresAt: request.otpExpiresAt
            }
        });

    } catch (error) {

        console.error(error);

        return res.status(
            error.statusCode || 500
        ).json({

            message:
                error.message ||
                "SERVER ERROR"
        });
    }
}


module.exports = {
    generatePickupOTP,
    verifyPickupOTP,
    resendPickupOTP,
    invalidatePickupOTP
};