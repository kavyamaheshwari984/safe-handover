const mongoose=require("mongoose");
const GuardianAuthorizationSchema = new mongoose.Schema({
    guardian: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    child: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Child",
        required: true
    },

    relationship: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["pending", "approved", "rejected", "expired"],
        default: "pending",
        required:true
    },

    validUntil: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model(
    "GuardianAuthorization",
    GuardianAuthorizationSchema
);