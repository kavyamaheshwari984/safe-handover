const mongoose = require("mongoose");

const pickupRequestSchema = new mongoose.Schema({

    // The child who is going to be picked up
    child: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Child",
        required: true
    },

    // The person requesting the pickup
    // Can be a parent OR a guardian
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // When the pickup request was created
    requestedAt: {
        type: Date,
        default: Date.now
    },

    // Request is valid only for 30 minutes
    requestExpiresAt: {
        type: Date,
        required: true
    },

    // Current state of the request
    status: {
        type: String,
        enum: [
            "PENDING",
            "APPROVED",
            "REJECTED",
            "EXPIRED",
            "COMPLETED",
            "CANCELLED"
        ],
        default: "PENDING"
    },

    // When the parent/admin approved the request
    approvedAt: {
        type: Date
    },

    // Once approved, pickup is valid for 1 hour
    pickupExpiresAt: {
        type: Date
    },

    // When the request was rejected
    rejectedAt: {
        type: Date
    },

    // OTP used by staff to verify the pickup
    otp: {
        type: String
    },

    // OTP validity
    otpExpiresAt: {
        type: Date
    }

});

module.exports = mongoose.model(
    "PickupRequest",
    pickupRequestSchema
);