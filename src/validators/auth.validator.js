const UserModel = require("../models/user.model");
const { body } = require("express-validator");

exports.signup = [
  body("firstname")
    .isLength({ min: 1 })
    .trim()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters.")
    .escape(),
  body("lastname")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Last name must be specified.")
    .isAlphanumeric()
    .withMessage("Last name has non-alphanumeric characters.")
    .escape(),
  body("email")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Email must be specified.")
    .isEmail()
    .withMessage("Email must be a valid email address.")
    .custom((value) => {
      return UserModel.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject("E-mail already in use");
        }
      });
    })
    .escape(),
  body("password")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Password must be 6 characters or greater.")
    .escape(),
];

exports.login = [
  body("email")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Email must be specified.")
    .isEmail()
    .withMessage("Email must be a valid email address.")
    .escape(),
  body("password")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Password must be specified.")
    .escape(),
];
