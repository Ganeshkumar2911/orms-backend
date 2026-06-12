const express = require("express");
const productController = require("../controllers/product.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const allowRoles = require("../middlewares/role.middleware");
const  { createProductValidation, updateProductValidation } = require("../validators/product.validator");
const validate = require("../middlewares/validation.middleware");


const router = express.Router();

router.get(
  "/get",
  authMiddleware.authUser,
  allowRoles("deepak_admin", "deepak_staff", "naveen_admin", "naveen_staff"),
  productController.getProducts,
);

router.post(
    "/create",
    authMiddleware.authUser,
    allowRoles("deepak_admin", "deepak_staff"),
    createProductValidation,
    validate,
    productController.createProduct
)

router.patch(
    "/update/:id",
    authMiddleware.authUser,
    allowRoles("deepak_admin", "deepak_staff"),
    updateProductValidation,
    validate,
    productController.updateProduct
);

module.exports = router

