const { body } = require("express-validator");

const createOrderValidation = [

    body("party")
        .notEmpty()
        .withMessage("Party is required")
        .isMongoId()
        .withMessage("Invalid party id"),

    body("transport")
        .notEmpty()
        .withMessage("Transport is required")
        .isMongoId()
        .withMessage("Invalid transport id"),

    body("items")
        .isArray({ min: 1 })
        .withMessage("At least one item is required"),

    body("items.*.product")
        .notEmpty()
        .withMessage("Product is required")
        .isMongoId()
        .withMessage("Invalid product id"),

    body("items.*.orderedQty")
        .notEmpty()
        .withMessage("Ordered quantity is required")
        .isInt({ min: 1 })
        .withMessage("Ordered quantity must be greater than 0"),

    body("items.*.price")
        .notEmpty()
        .withMessage("Price is required")
        .isFloat({ min: 0 })
        .withMessage("Price must be 0 or greater"),

];

const dispatchOrderValidation = [
    body("items")
        .isArray({ min: 1 })
        .withMessage("At least one item is required"),

    body("items.*.product")
        .isMongoId()
        .withMessage("Invalid product id"),

    body("items.*.dispatchQty")
        .isInt({ min: 1 })
        .withMessage("Dispatch quantity must be greater than 0")
];

const cancelOrderValidation = [
    body("remark")
        .trim()
        .notEmpty()
        .withMessage("Cancellation remark is required")
];

module.exports = {
    createOrderValidation,
    cancelOrderValidation,
    dispatchOrderValidation
};