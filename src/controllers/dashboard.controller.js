const orderModel = require("../models/order.model");

async function getDashboard(req, res) {

    const [
        waitingApproval,
        waitingExecution,
        pendingDispatch,
        completedToday
    ] = await Promise.all([

        orderModel.countDocuments({
            status: "CREATED"
        }),

        orderModel.countDocuments({
            status: "APPROVED"
        }),

        orderModel.countDocuments({
            status: {
                $in: [
                    "EXECUTED",
                    "PARTIALLY_DISPATCHED"
                ]
            }
        }),

        orderModel.countDocuments({
            status: "COMPLETED",
            updatedAt: {
                $gte: new Date(
                    new Date().setHours(0, 0, 0, 0)
                )
            }
        })

    ]);

    // NEEDS ATTENTION

    const twoDaysAgo = new Date();

    twoDaysAgo.setDate(
        twoDaysAgo.getDate() - 2
    );

    const needsAttention = await orderModel
        .find({
            status: {
                $in: [
                    "CREATED",
                    "APPROVED",
                    "EXECUTED",
                    "PARTIALLY_DISPATCHED"
                ]
            },
            updatedAt: {
                $lte: twoDaysAgo
            }
        })
        .select(
            "orderNumber status updatedAt"
        )
        .sort({
            updatedAt: 1
        })
        .limit(10);

    const attentionData = needsAttention.map(order => {

        const daysWaiting = Math.floor(
            (
                Date.now() -
                order.updatedAt.getTime()
            ) /
            (1000 * 60 * 60 * 24)
        );

        return {
            orderId: order._id,
            orderNumber: order.orderNumber,
            status: order.status,
            daysWaiting
        };
    });

    // PENDING DISPATCH

    const pendingDispatchOrders = await orderModel
        .find({
            status: {
                $in: [
                    "EXECUTED",
                    "PARTIALLY_DISPATCHED"
                ]
            }
        })
        .select(
            "orderNumber party status"
        )
        .populate(
            "party",
            "name"
        )
        .sort({
            createdAt: -1
        })
        .limit(10);

    const pendingDispatchData =
        pendingDispatchOrders.map(order => ({
            orderId: order._id,
            orderNumber: order.orderNumber,
            partyName: order.party?.name,
            status: order.status
        }));

    res.status(200).json({
        summary: {
            waitingApproval,
            waitingExecution,
            pendingDispatch,
            completedToday
        },
        needsAttention: attentionData,
        pendingDispatch: pendingDispatchData
    });
}

module.exports = {
    getDashboard
};