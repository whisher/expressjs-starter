const express = require("express");
const AuthController = require("../controllers/auth.controller");
const AuthValidator = require("../validators/auth.validator");
const router = express.Router();
const auth = require("../middlewares/jwt");

router.get("/account", auth, AuthController.account);
router.post("/login", AuthValidator.login, AuthController.login);
router.post("/signup", AuthValidator.signup, AuthController.signup);

module.exports = router;
