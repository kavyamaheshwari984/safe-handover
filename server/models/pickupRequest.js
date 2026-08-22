const mongoose = require("mongoose");

const pickupRequestSchema = new mongoose.Schema({

    child: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Child",
        required: true
    },

    guardian: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    status: {
        type: String,
        required: true,
        default: "PENDING"
    },

    requestedAt: {
        type: Date,
        default: Date.now
    },

    approvedAt: {
        type: Date
    },

    rejectedAt: {
        type: Date
    },

    otp: {
        type: String
    },

    otpExpiresAt: {
        type: Date
    }
});

module.exports = mongoose.model(
    "PickupRequest",
    pickupRequestSchema
);