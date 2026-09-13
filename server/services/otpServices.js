const PickupRequest = require("../models/pickupRequest");
const Child = require("../models/child");
const User = require("../models/user");
const Handover = require("../models/handover");
const auditLogService =
    require("./auditLogService");
async function generatePickupOTP(
    pickupRequestId,
    userId,
    role
) {

    // 1. Find pickup request

    const request =
        await PickupRequest.findById(pickupRequestId);

    if (!request) {

        const error = new Error(
            "PICKUP REQUEST CANNOT BE FOUND"
        );

        error.statusCode = 404;
        throw error;
    }


    // 2. Check who is generating OTP

    if (role === "guardian") {

        const error = new Error(
            "YOU ARE NOT ALLOWED TO GENERATE THE OTP"
        );

        error.statusCode = 403;
        throw error;
    }


    // 3. Find child

    const child =
        await Child.findById(request.child);

    if (!child) {

        const error = new Error(
            "CHILD CANNOT BE FOUND"
        );

        error.statusCode = 404;
        throw error;
    }


    // 4. Parent can generate OTP
    // only for their own child

    if (role === "parent") {

        if (
            child.parent.toString() !==
            userId.toString()
        ) {

            const error = new Error(
                "YOU ARE NOT ALLOWED TO GENERATE THE OTP"
            );

            error.statusCode = 403;
            throw error;
        }
    }


    // 5. Admin can generate OTP

    else if (role === "admin") {

        // Admin is allowed
    }


    // 6. Other roles are not allowed

    else {

        const error = new Error(
            "YOU ARE NOT ALLOWED TO GENERATE THE OTP"
        );

        error.statusCode = 403;
        throw error;
    }


    // 7. Request must be approved

    if (request.status !== "APPROVED") {

        const error = new Error(
            "PICKUP REQUEST SHOULD BE APPROVED"
        );

        error.statusCode = 400;
        throw error;
    }


    // 8. Check 1-hour pickup expiry

    if (
        request.pickupExpiresAt &&
        request.pickupExpiresAt < new Date()
    ) {

        request.status = "EXPIRED";

        await request.save();

        const error = new Error(
            "PICKUP APPROVAL IS EXPIRED"
        );

        error.statusCode = 409;
        throw error;
    }


    // 9. Generate 6-digit OTP

    const otp =
        Math.floor(
            100000 +
            Math.random() * 900000
        ).toString();


    // 10. OTP expires after 5 minutes

    const otpExpiresAt =
        new Date(
            Date.now() +
            5 * 60 * 1000
        );


    request.otp = otp;
    request.otpExpiresAt = otpExpiresAt;


    // 11. Save

    await request.save();
    //audit recordeed
    await auditLogService.createAuditLog(
        "OTP_GENERATED",
        userId,
        request.child,
        request._id,
        null,
        "Pickup OTP generated"
    );
    // 12. Return request

    return request;
}

async function verifyPickupOTP(
    pickupRequestId,
    otp,
    staffId
) {

    // 1. Find request

    const request =
        await PickupRequest.findById(pickupRequestId);

    if (!request) {

        const error = new Error(
            "PICKUP REQUEST CANNOT BE FOUND"
        );

        error.statusCode = 404;
        throw error;
    }


    // 2. Request must be approved

    if (request.status !== "APPROVED") {

        const error = new Error(
            "PICKUP REQUEST SHOULD BE APPROVED"
        );

        error.statusCode = 400;
        throw error;
    }


    // 3. OTP must exist

    if (!request.otp) {

        const error = new Error(
            "OTP NOT GENERATED"
        );

        error.statusCode = 400;
        throw error;
    }


    // 4. Check OTP expiry

    if (
        !request.otpExpiresAt ||
        request.otpExpiresAt < new Date()
    ) {

        const error = new Error(
            "OTP EXPIRED"
        );

        error.statusCode = 400;
        throw error;
    }


    // 5. Compare OTP

    if (request.otp !== otp) {

        const error = new Error(
            "OTP INCORRECT"
        );

        error.statusCode = 400;
        throw error;
    }


    // 6. Check staff

    const user =
        await User.findById(staffId);

    if (
        !user ||
        user.role !== "staff"
    ) {

        const error = new Error(
            "YOU ARE NOT AUTHORIZED AS STAFF"
        );

        error.statusCode = 403;
        throw error;
    }
    await auditLogService.createAuditLog(
        "OTP_VERIFIED",
        staffId,
        request.child,
        request._id,
        null,
        "Pickup OTP verified by staff"
    );

    // 7. Create handover

    const handover =
        await Handover.create({

            pickupRequest: request._id,

            child: request.child,

            pickedUpBy: request.requestedBy,

            staff: staffId
        });


    // 8. Complete pickup request

    request.status = "COMPLETED";

    request.otp = undefined;

    request.otpExpiresAt = undefined;

    await request.save();

    await auditLogService.createAuditLog(
        "HANDOVER_COMPLETED",
        staffId,
        request.child,
        request._id,
        handover._id,
        "Child handed over successfully"
    );
    // 9. Return handover

    return handover;
}

async function resendPickupOTP(
    pickupRequestId,
    userId,
    role
) {

    // 1. Find pickup request

    const request =
        await PickupRequest.findById(pickupRequestId);

    if (!request) {

        const error = new Error(
            "PICKUP REQUEST CANNOT BE FOUND"
        );

        error.statusCode = 404;
        throw error;
    }


    // 2. Guardian cannot resend OTP

    if (role === "guardian") {

        const error = new Error(
            "YOU ARE NOT ALLOWED TO RESEND OTP"
        );

        error.statusCode = 403;
        throw error;
    }


    // 3. Check parent ownership

    if (role === "parent") {

        const child =
            await Child.findById(request.child);

        if (!child) {

            const error = new Error(
                "CHILD CANNOT BE FOUND"
            );

            error.statusCode = 404;
            throw error;
        }

        if (
            child.parent.toString() !==
            userId.toString()
        ) {

            const error = new Error(
                "YOU ARE NOT ALLOWED TO RESEND OTP"
            );

            error.statusCode = 403;
            throw error;
        }
    }


    // 4. Admin is allowed

    else if (role === "admin") {

        // allowed
    }


    // 5. Other roles are not allowed

    else {

        const error = new Error(
            "YOU ARE NOT ALLOWED TO RESEND OTP"
        );

        error.statusCode = 403;
        throw error;
    }


    // 6. Request must be approved

    if (request.status !== "APPROVED") {

        const error = new Error(
            "PICKUP REQUEST SHOULD BE APPROVED"
        );

        error.statusCode = 400;
        throw error;
    }


    // 7. Check pickup approval expiry

    if (
        !request.pickupExpiresAt ||
        request.pickupExpiresAt < new Date()
    ) {

        request.status = "EXPIRED";

        await request.save();

        const error = new Error(
            "PICKUP APPROVAL IS EXPIRED"
        );

        error.statusCode = 409;
        throw error;
    }


    // 8. Generate new OTP

    const otp =
        Math.floor(
            100000 +
            Math.random() * 900000
        ).toString();


    // 9. Set new OTP expiry

    request.otp = otp;

    request.otpExpiresAt =
        new Date(
            Date.now() +
            5 * 60 * 1000
        );


    // 10. Save

    await request.save();
    await auditLogService.createAuditLog(
        "OTP_RESENT",
        userId,
        request.child,
        request._id,
        null,
        "Pickup OTP resent"
    );

    return request;
}

async function invalidatePickupOTP(
    pickupRequestId,
    userId,
    role
) {

    // 1. Find pickup request

    const request =
        await PickupRequest.findById(pickupRequestId);

    if (!request) {

        const error = new Error(
            "PICKUP REQUEST CANNOT BE FOUND"
        );

        error.statusCode = 404;
        throw error;
    }


    // 2. Guardian cannot invalidate OTP

    if (role === "guardian") {

        const error = new Error(
            "YOU ARE NOT ALLOWED TO INVALIDATE OTP"
        );

        error.statusCode = 403;
        throw error;
    }


    // 3. Parent can invalidate
    // only for their own child

    if (role === "parent") {

        const child =
            await Child.findById(request.child);

        if (!child) {

            const error = new Error(
                "CHILD CANNOT BE FOUND"
            );

            error.statusCode = 404;
            throw error;
        }

        if (
            child.parent.toString() !==
            userId.toString()
        ) {

            const error = new Error(
                "YOU ARE NOT ALLOWED TO INVALIDATE OTP"
            );

            error.statusCode = 403;
            throw error;
        }
    }


    // 4. Admin is allowed

    else if (role === "admin") {

        // allowed
    }


    // 5. Other roles are not allowed

    else {

        const error = new Error(
            "YOU ARE NOT ALLOWED TO INVALIDATE OTP"
        );

        error.statusCode = 403;
        throw error;
    }


    // 6. Request must be approved

    if (request.status !== "APPROVED") {

        const error = new Error(
            "PICKUP REQUEST SHOULD BE APPROVED"
        );

        error.statusCode = 400;
        throw error;
    }


    // 7. Check whether OTP exists

    if (!request.otp) {

        const error = new Error(
            "NO ACTIVE OTP FOUND"
        );

        error.statusCode = 400;
        throw error;
    }


    // 8. Remove OTP

    request.otp = undefined;
    request.otpExpiresAt = undefined;


    // 9. Save

    await request.save();
    await auditLogService.createAuditLog(
        "OTP_INVALIDATED",
        userId,
        request.child,
        request._id,
        null,
        "Pickup OTP invalidated"
    );

    return request;
}


module.exports = {
    generatePickupOTP,
    verifyPickupOTP,
    resendPickupOTP,
    invalidatePickupOTP
};
