const { body } = require("express-validator");

const createTransportValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Transport name is required"),
];

const updateTransportValidation = [
  body().custom((value) => {
    if (Object.keys(value).length === 0) {
      throw new Error("No fields provided for update");
    }

    return true;
  }),

  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Transport name cannot be empty"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be boolean"),
];

module.exports = {
  createTransportValidation,
  updateTransportValidation,
};