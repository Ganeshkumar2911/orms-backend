const  orderModel = require("../models/order.model");
const partyModel = require("../models/party.model");
const transportModel = require("../models/transport.model");
const productModel = require("../models/product.model");
const sendNotification = require("../utils/sendNotification");

async function createOrder(req, res) {

    const { party, transport, items } = req.body;

    // Check Party

    const partyExists = await partyModel.findById(party);

    if (!partyExists || !partyExists.isActive) {
        return res.status(404).json({
            message: "Party not found or inactive"
        });
    }

    // Check Transport

    const transportExists = await transportModel.findById(transport);

    if (!transportExists || !transportExists.isActive) {
        return res.status(404).json({
            message: "Transport not found or inactive"
        });
    }

    // Check Products

    const productIds = items.map(item => item.product);

    const products = await productModel.find({
        _id: { $in: productIds }
    });

    if (products.length !== productIds.length) {
        return res.status(404).json({
            message: "One or more products not found"
        });
    }

    const inactiveProducts = products.filter(
        product => !product.isActive
    );

    if (inactiveProducts.length > 0) {
        return res.status(400).json({
            message: "One or more products are inactive"
        });
    }

    // Generate Order Number

    let orderNumber = "";

    const lastOrder = await orderModel
        .findOne()
        .sort({ orderNumber: -1 });
        
    if (!lastOrder) {
        orderNumber = "ORD-0001";
    } else {
        const lastNumber = Number(
            lastOrder.orderNumber.split("-")[1]
        );

        orderNumber = `ORD-${String(lastNumber + 1).padStart(4, "0")}`;
    }

    // Create Order

    const order = await orderModel.create({
        orderNumber,
        party,
        transport,
        items,
        createdBy: req.user.id,
    });

    await sendNotification({
        roles: ["deepak_admin"],
        title: "📦 New Order Created",
        body: `Order ${order.orderNumber} has been created`,
    });

    res.status(201).json({
        message: "Order created successfully",
        order,
    });
}

async function getOrders(req, res) {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const status = req.query.status;
    const partyId = req.query.partyId;
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    const filter = {};

    if (search) {
        filter.orderNumber = {
            $regex: search,
            $options: "i",
        };
    }

    if (status) {
        filter.status = status;
    }
    if (partyId) {
        filter.party = partyId;
    }

    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;

    if (fromDate || toDate) {
        filter.createdAt = {};

        if (fromDate) {
            filter.createdAt.$gte = new Date(fromDate);
        }

        if (toDate) {
            const endDate = new Date(toDate);
            endDate.setHours(23, 59, 59, 999);

            filter.createdAt.$lte = endDate;
        }
    }

    const orders = await orderModel
        .find(filter)
        .select(
            "orderNumber party transport status createdAt"
        )
        .sort({ createdAt: -1 })
        .populate("party", "name")
        .populate("transport", "name")
        .skip(skip)
        .limit(limit);

    const totalOrders = await orderModel.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / limit);

    res.status(200).json({
        data: orders,
        currentPage: page,
        totalPages,
        totalOrders,
    });
}

async function getOrderById(req, res) {

    const { id } = req.params;

    const order = await orderModel
        .findById(id)
        .populate("party")
        .populate("transport")
        .populate("items.product", "name")
        .populate("createdBy", "name role")
        .populate("approvedBy", "name role")
        .populate("executedBy", "name role")
        .populate("cancelledBy", "name role");

    if (!order) {
        return res.status(404).json({
            message: "Order not found"
        });
    }

    res.status(200).json({
        data: order
    });
}

async function approveOrder(req, res) {

    const { id } = req.params;

    const order = await orderModel.findById(id);

    if (!order) {
        return res.status(404).json({
            message: "Order not found"
        });
    }

    if (order.status !== "CREATED") {
        return res.status(400).json({
            message: "Only CREATED orders can be approved"
        });
    }

    order.status = "APPROVED";
    order.approvedBy = req.user.id;
    order.approvedAt = new Date();

    await order.save();

    await sendNotification({
        roles: [
            "deepak_staff",
            "naveen_admin"
        ],
        title: "🔔 Order Approved",
        body: `Order ${order.orderNumber} has been approved`,
    });

    res.status(200).json({
        message: "Order approved successfully",
        order
    });
}

async function executeOrder(req, res) {

    const { id } = req.params;

    const order = await orderModel.findById(id);

    if (!order) {
        return res.status(404).json({
            message: "Order not found"
        });
    }

    if (order.status !== "APPROVED") {
        return res.status(400).json({
            message: "Only APPROVED orders can be executed"
        });
    }

    order.status = "EXECUTED";
    order.executedBy = req.user.id;
    order.executedAt = new Date();

    await order.save();

    await sendNotification({
        roles: [
            "deepak_staff",
            "deepak_admin",
            "naveen_staff"
        ],
        title: "Order Executed",
        body: `Order ${order.orderNumber} has been executed`,
    });

    res.status(200).json({
        message: "Order executed successfully",
        order
    });
}

async function dispatchOrder(req, res) {

    const { id } = req.params;
    const { items } = req.body;

    const order = await orderModel.findById(id);

    if (!order) {
        return res.status(404).json({
            message: "Order not found"
        });
    }

    if (
        order.status !== "EXECUTED"
    ) {
        return res.status(400).json({
            message: "Only EXECUTED orders can be dispatched"
        });
    }

    // Process incoming dispatch items

    for (const dispatchItem of items) {

        const orderItem = order.items.find(item => item.product.toString() === dispatchItem.product);

        if (!orderItem) {
            return res.status(400).json({
                message: `Product ${dispatchItem.product} not found in order`
            });
        }

        const newDispatchedQty =
            orderItem.dispatchedQty +
            dispatchItem.dispatchQty;

        if (newDispatchedQty > orderItem.orderedQty) {
            return res.status(400).json({
                message: `Dispatch quantity exceeds ordered quantity for product ${dispatchItem.product}`
            });
        }

        orderItem.dispatchedQty = newDispatchedQty;
    }

    // Recalculate status

    const isCompleted = order.items.every(
        item => item.dispatchedQty === item.orderedQty
    );

    if (isCompleted) {
        order.status = "COMPLETED";

        await sendNotification({
            roles: [
                "deepak_staff",
                "deepak_admin",
                "naveen_admin"
            ],
            title: "✅ Order Completed",
            body: `Order ${order.orderNumber} has been completed`,
        });
    }
    // } else {
    //     order.status = "PARTIALLY_DISPATCHED";
    // }

    order.lastDispatchedAt = new Date();

    await order.save();

    await sendNotification({
        roles: [
            "deepak_staff",
            "deepak_admin",
            "naveen_admin"
        ],
        title: "Order Dispatched 🚛",
        body: `Order ${order.orderNumber} has been dispatched`,
    });

    res.status(200).json({
        message: "Order dispatched successfully",
        order
    });
}

async function cancelOrder(req, res) {

    const { id } = req.params;
    const { cancelReason } = req.body;

    const order = await orderModel.findById(id);

    if (!order) {
        return res.status(404).json({
            message: "Order not found"
        });
    }

    if (
        order.status === "PARTIALLY_DISPATCHED" ||
        order.status === "COMPLETED" ||
        order.status === "CANCELLED"
    ) {
        return res.status(400).json({
            message: `Cannot cancel order in ${order.status} status`
        });
    }

    order.status = "CANCELLED";
    order.cancelledBy = req.user.id;
    order.cancelledAt = new Date();
    order.cancelReason = cancelReason;

    await order.save();

    res.status(200).json({
        message: "Order cancelled successfully",
        order
    });
}

async function updateOrder(req, res) {

    const { id } = req.params;

    const {
        party,
        transport,
        items
    } = req.body;

    const order = await orderModel.findById(id);

    if (!order) {
        return res.status(404).json({
            message: "Order not found"
        });
    }

    if (order.status !== "CREATED") {
        return res.status(400).json({
            message: "Only CREATED orders can be updated"
        });
    }

    // Validate Party

    const partyExists =
        await partyModel.findById(party);

    if (!partyExists || !partyExists.isActive) {
        return res.status(404).json({
            message: "Party not found or inactive"
        });
    }

    // Validate Transport

    const transportExists =
        await transportModel.findById(transport);

    if (
        !transportExists ||
        !transportExists.isActive
    ) {
        return res.status(404).json({
            message: "Transport not found or inactive"
        });
    }

    // Validate Products

    const productIds =
        items.map(item => item.product);

    const products =
        await productModel.find({
            _id: {
                $in: productIds
            }
        });

    if (products.length !== productIds.length) {
        return res.status(404).json({
            message: "One or more products not found"
        });
    }

    const inactiveProducts =
        products.filter(
            product => !product.isActive
        );

    if (inactiveProducts.length > 0) {
        return res.status(400).json({
            message: "One or more products are inactive"
        });
    }

    // Update Order

    order.party = party;
    order.transport = transport;
    order.items = items;

    await order.save();

    res.status(200).json({
        message: "Order updated successfully",
        order
    });
}


module.exports = {

    createOrder,
    getOrders,
    getOrderById,
    approveOrder,
    executeOrder,
    dispatchOrder,
    cancelOrder,
    updateOrder
}
