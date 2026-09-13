const mongoose = require("mongoose");

const ChildSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    dateOfBirth: {
        type: Date,
        required: true
    },

    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    className: {
        type: String,
        required: true
    },

    rollNo: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("Child", ChildSchema);