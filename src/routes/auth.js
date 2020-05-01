var express = require("express");
const AuthController = require("../controllers/AuthController");
const AuthValidator = require("../validators/AuthValidator");
var router = express.Router();

router.post("/register", AuthValidator.register, AuthController.register);
router.post("/login", AuthValidator.login, AuthController.login);

module.exports = router;
