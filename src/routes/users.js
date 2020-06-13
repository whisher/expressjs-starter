const express = require("express");
const UserController = require("../controllers/users.controller");

const router = express.Router();
const auth = require("../middlewares/jwt");

router.get("/", UserController.getUsers);

module.exports = router;
