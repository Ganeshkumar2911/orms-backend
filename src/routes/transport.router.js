const express = require("express");
const transportController = require("../controllers/transport.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const allowRoles = require("../middlewares/role.middleware");
const { createTransportValidation, updateTransportValidation} = require("../validators/transport.validator");
const validate = require("../middlewares/validation.middleware");
const router = express.Router();

router.get(
    "/get",
    authMiddleware.authUser,
    allowRoles("deepak_admin", "deepak_staff", "naveen_admin", "naveen_staff"),
    transportController.getTransports,
)

router.post(
    "/create",
    authMiddleware.authUser,
    allowRoles("deepak_admin", "deepak_staff"),
    createTransportValidation,
    validate,
    transportController.createTransport
)

router.patch(
    "/update/:id",
    authMiddleware.authUser,
    allowRoles("deepak_admin", "deepak_staff"),
    updateTransportValidation,
    validate,
    transportController.updateTransport
);

module.exports = router;
