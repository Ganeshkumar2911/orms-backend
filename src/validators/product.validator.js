const { body } = require("express-validator");

const createProductValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Product name is required")
];

const updateProductValidation = [
    body()
        .custom(value => {
            if (Object.keys(value).length === 0) {
                throw new Error("No fields provided for update");
            }
            return true;
        }),
    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Product name cannot be empty"),

    body("isActive")
        .optional()
        .isBoolean()
        .withMessage("isActive must be boolean")
];

module.exports = {
    createProductValidation,
    updateProductValidation
};