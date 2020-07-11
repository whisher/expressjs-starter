"use strict";
const mongoose = require("mongoose");
const debug = require("debug")("app:server");
var MONGODB_URL = process.env.MONGODB_URL;
const options = { useNewUrlParser: true, useUnifiedTopology: true };
const connection = (isProd) => {
  const db = isProd ? "production1" : "development3";
  const uri = `${MONGODB_URL}/${db}`;
  mongoose
    .connect(uri, options)
    .then(() => {
      debug("Connected to database!");
    })
    .catch(() => {
      debug("Connection failed!");
    });
};

module.exports = connection;
