const express = require("express");
const AuthController = require("../controllers/AuthController");
const AuthValidator = require("../validators/AuthValidator");
const router = express.Router();
const auth = require("../middlewares/jwt");

router.post("/login", AuthValidator.login, AuthController.login);
router.get("/me", auth, AuthController.me);
router.post("/signup", AuthValidator.signup, AuthController.signup);

module.exports = router;
