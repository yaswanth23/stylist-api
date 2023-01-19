const express = require("express");
const defaultRouter = express.Router();
const { PingController } = require("../controllers");

defaultRouter.get("/ping", PingController.GET_ping);

const authRouter = require("./auth.router");
const userRouter = require("./user.router");
const picsRouter = require("./pics.router");
const closetRouter = require("./closet.router");
const outfitRouter = require("./outfit.router");
const adminRouter = require("./admin.router");

const init = (app) => {
  app.use("/api", defaultRouter);
  app.use("/api", authRouter);
  app.use("/api", userRouter);
  app.use("/api", picsRouter);
  app.use("/api", closetRouter);
  app.use("/api", outfitRouter);
  app.use("/api/admin", adminRouter);
};

module.exports = init;
