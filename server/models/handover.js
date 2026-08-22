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

    guardian: {
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
    }
});

module.exports = mongoose.model("Handover", HandoverSchema);