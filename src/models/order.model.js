const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        orderedQty: {
            type: Number,
            required: true,
            min: 1,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        dispatchedQty: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {
        _id: false,
    }
);

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            required: true,
            unique: true,
        },

        party: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Party",
            required: true,
        },

        transport: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transport",
            required: true,
        },

        items: {
            type: [orderItemSchema],
            required: true,
            validate: {
                validator: function (items) {
                    return items.length > 0;
                },
                message: "Order must contain at least one item",
            },
        },

        status: {
            type: String,
            enum: [
                "CREATED",
                "APPROVED",
                "EXECUTED",
                // "PARTIALLY_DISPATCHED",
                "COMPLETED",
                "CANCELLED",
            ],
            default: "CREATED",
        },

        cancelReason: {
            type: String,
            trim: true,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        executedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        cancelledBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        approvedAt: Date,

        executedAt: Date,

        cancelledAt: Date,

        lastDispatchedAt: Date,
    },
    {
        timestamps: true,
    }
);

orderSchema.index({ status: 1 });
orderSchema.index({ party: 1 });

module.exports = mongoose.model("Order", orderSchema);