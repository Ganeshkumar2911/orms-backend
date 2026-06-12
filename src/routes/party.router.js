const express = require("express");
const partyController = require("../controllers/party.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const allowRoles = require("../middlewares/role.middleware");
const { createPartyValidation, updatePartyValidation } = require("../validators/party.validator");
const validate = require("../middlewares/validation.middleware");

const router = express.Router();

router.get(
  "/get",
  authMiddleware.authUser,
  allowRoles("deepak_admin", "deepak_staff", "naveen_admin", "naveen_staff"),
  partyController.getParties,
);

router.post(
  "/create",
  authMiddleware.authUser,
  allowRoles("deepak_admin", "deepak_staff"),
  createPartyValidation,
  validate,
  partyController.createParty
);

router.patch(
  "/update/:id",
  authMiddleware.authUser,
  allowRoles("deepak_admin", "deepak_staff"),
  updatePartyValidation,
  validate,
  partyController.updateParty
);

module.exports = router;
