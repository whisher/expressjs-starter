const UserModel = require("../models/user.model");
const { validationResult } = require("express-validator");
//helper file to prepare responses.
const apiResponse = require("../helpers/api-response.helper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiResponse.validationErrorWithData(res, errors.array());
    }

    bcrypt.hash(req.body.password, 10, (err, hash) => {
      const user = new UserModel({
        username: req.body.username,
        email: req.body.email,
        password: hash,
      });

      // Save user.
      user.save((err) => {
        if (err) {
          return apiResponse.ErrorResponse(res, err);
        }
        const userData = {
          _id: user._id,
          username: user.username,
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
                avatar: user.avatar,
                username: user.username,
                email: user.email,
              };
              //Prepare JWT token for authentication
              const jwtPayload = userData;
              const jwtData = {
                expiresIn: process.env.JWT_TIMEOUT_DURATION,
              };
              const secret = process.env.JWT_SECRET;
              //Generated JWT token with Payload and secret.
              const token = jwt.sign(jwtPayload, secret, jwtData);
              return apiResponse.successResponseWithData(res, token);
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

exports.account = (req, res) => {
  res.status(200).json(req.user);
};
