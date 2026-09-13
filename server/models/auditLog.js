const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({

    action: {
        type: String,
        required: true
    },

    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    child: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Child"
    },

    pickupRequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PickupRequest"
    },

    handover: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Handover"
    },

    details: {
        type: String
    },

    performedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model(
    "AuditLog",
    auditLogSchema
);