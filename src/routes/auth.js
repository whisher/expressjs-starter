const express = require("express");
const AuthController = require("../controllers/auth.controller");
const AuthValidator = require("../validators/auth.validator");
const router = express.Router();
const auth = require("../middlewares/jwt");

router.post("/login", AuthValidator.login, AuthController.login);
router.get("/me", auth, AuthController.me);
router.post("/signup", AuthValidator.signup, AuthController.signup);

module.exports = router;
