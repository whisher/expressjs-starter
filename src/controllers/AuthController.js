const UserModel = require("../models/UserModel");
const { validationResult } = require("express-validator");
//helper file to prepare responses.
const apiResponse = require("../helpers/apiResponse");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * User registration.
 *
 * @param {string}      firstName
 * @param {string}      lastName
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */
exports.signup = (req, res) => {
  try {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Display sanitized values/errors messages.
      return apiResponse.validationErrorWithData(res, errors.array());
    }
    //hash input password
    bcrypt.hash(req.body.password, 10, function (err, hash) {
      // Create User object with escaped and trimmed data
      var user = new UserModel({
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        email: req.body.email,
        password: hash,
      });

      // Save user.
      user.save(function (err) {
        if (err) {
          return apiResponse.ErrorResponse(res, err);
        }
        let userData = {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        };
        return apiResponse.successResponseWithData(res, userData);
      });
    });
  } catch (err) {
    //throw error in json response with status 500.
    return apiResponse.ErrorResponse(res, err);
  }
};

/**
 * User login.
 *
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */

exports.login = (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiResponse.validationErrorWithData(res, errors.array());
    }
    UserModel.findOne({ email: req.body.email }).then((user) => {
      if (user) {
        //Compare given password with db's hash.
        bcrypt.compare(req.body.password, user.password, (err, same) => {
          if (same) {
            // Check User's account active or not.
            if (user.status) {
              let userData = {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
              };
              //Prepare JWT token for authentication
              const jwtPayload = userData;
              const jwtData = {
                expiresIn: process.env.JWT_TIMEOUT_DURATION,
              };
              const secret = process.env.JWT_SECRET;
              //Generated JWT token with Payload and secret.
              userData.token = jwt.sign(jwtPayload, secret, jwtData);
              return apiResponse.successResponseWithData(res, userData);
            } else {
              return apiResponse.unauthorizedResponse(
                res,
                "Account is not active. Please contact admin."
              );
            }
          } else {
            return apiResponse.unauthorizedResponse(
              res,
              "Email or Password wrong."
            );
          }
        });
      } else {
        return apiResponse.unauthorizedResponse(
          res,
          "Email or Password wrong."
        );
      }
    });
  } catch (err) {
    return apiResponse.ErrorResponse(res, err);
  }
};

exports.me = (req, res) => {
  res.status(200).json(req.user);
};
