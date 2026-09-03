const mongoose = require("mongoose");

const HandoverSchema = new mongoose.Schema({

    pickupRequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PickupRequest",
        required: true
    },

    child: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Child",
        required: true
    },

    pickedUpBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    handedOverAt: {
        type: Date,
        default: Date.now
    },
    verificationMethod: {
        type: String,
        enum: ["OTP"],
        default: "OTP"
    }
});

module.exports = mongoose.model("Handover", HandoverSchema);