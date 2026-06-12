const mongoose = require("mongoose");

const partySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        address: {
            type: String,
            required: true,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Party", partySchema);