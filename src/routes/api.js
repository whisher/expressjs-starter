const express = require("express");
const authRouter = require("./auth");
const usersRouter = require("./users");

const app = express();

app.use("/auth/", authRouter);
app.use("/users/", usersRouter);

module.exports = app;
