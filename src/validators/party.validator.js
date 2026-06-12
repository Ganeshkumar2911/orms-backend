const { body } = require("express-validator");

const createPartyValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Party name is required"),

    body("address")
        .trim()
        .notEmpty()
        .withMessage("Party address is required"),
]

const updatePartyValidation = [
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
        .withMessage("Party name cannot be empty"),

    body("address")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Party address cannot be empty"),

    body("isActive")
        .optional()
        .isBoolean()
        .withMessage("isActive must be boolean")
]

module.exports = {
    createPartyValidation,
    updatePartyValidation
}