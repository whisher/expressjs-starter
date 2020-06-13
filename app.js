require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const logger = require("morgan");
const path = require("path");

const indexRouter = require("./src/routes/index");
const apiRouter = require("./src/routes/api");
const apiResponse = require("./src/helpers/api-response.helper");

// DB connection
const isProd = process.env.NODE_ENV === "production";
require("./src/db/connect")(isProd);

const app = express();

if (process.env.NODE_ENV !== "test") {
  app.use(logger("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(cors());

// heroku to get https protocol
app.enable("trust proxy");
app.use("/assets", express.static(path.join("assets")));

//Route Prefixes
app.use("/", indexRouter);
app.use("/api/", apiRouter);

// throw 404 if URL not found
app.all("*", function (_, res) {
  return apiResponse.notFoundResponse(res, "Page not found");
});

app.use((err, _, res) => {
  if (err.name == "UnauthorizedError") {
    return apiResponse.unauthorizedResponse(res, err.message);
  }
});

module.exports = app;
