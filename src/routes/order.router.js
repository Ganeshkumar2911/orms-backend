const express = require('express');
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const allowRoles = require('../middlewares/role.middleware');
const { createOrderValidation, dispatchOrderValidation, cancelOrderValidation, updateOrderValidation } = require('../validators/order.validator');
const validate = require('../middlewares/validation.middleware');

const router = express.Router();

router.post(
    "/create",
    authMiddleware.authUser,
    allowRoles("deepak_admin", "deepak_staff"),
    createOrderValidation,
    validate,
    orderController.createOrder
);

router.get(
    "/get",
    authMiddleware.authUser,
    allowRoles(
        "deepak_admin",
        "deepak_staff",
        "naveen_admin",
        "naveen_staff"
    ),
    orderController.getOrders
);

router.get(
    "/get/:id",
    authMiddleware.authUser,
    allowRoles(
        "deepak_admin",
        "deepak_staff",
        "naveen_admin",
        "naveen_staff"
    ),
    orderController.getOrderById
);

router.patch(
    "/approve/:id",
    authMiddleware.authUser,
    allowRoles("deepak_admin"),
    orderController.approveOrder
);

router.patch(
    "/execute/:id",
    authMiddleware.authUser,
    allowRoles("naveen_admin"),
    orderController.executeOrder
);

router.patch(
    "/dispatch/:id",
    authMiddleware.authUser,
    allowRoles(
        "naveen_admin",
        "naveen_staff"
    ),
    dispatchOrderValidation,
    validate,
    orderController.dispatchOrder
);

router.patch(
    "/cancel/:id",
    authMiddleware.authUser,
    allowRoles(
        "deepak_admin",
        "naveen_admin"
    ),
    cancelOrderValidation,
    validate,
    orderController.cancelOrder
);
router.patch(
    "/update/:id",
    authMiddleware.authUser,
    allowRoles(
        "deepak_admin",
        "deepak_staff"
    ),
    updateOrderValidation,
    validate,
    orderController.updateOrder
);

module.exports = router;