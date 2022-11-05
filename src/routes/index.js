const express = require("express");
const defaultRouter = express.Router();
const { PingController } = require("../controllers");

defaultRouter.get("/ping", PingController.GET_ping);

const authRouter = require("./auth.router");
const userRouter = require("./user.router");

const init = (app) => {
  app.use("/api", defaultRouter);
  app.use("/api", authRouter);
  app.use("/api", userRouter);
};

module.exports = init;
