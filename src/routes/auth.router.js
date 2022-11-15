const express = require("express");
const router = express.Router();
const path = require("path");
const { OtpController, AuthController } = require("../controllers");

router.post("/login", AuthController.POST_login);
router.post("/sendOtp", OtpController.POST_sendOtp);
router.post("/verifyOtp", OtpController.POST_verifyOtp);
router.post("/deleteAccount", AuthController.POST_deleteAccount);
router.get("/terms_and_conditions", function (req, res) {
  res.sendFile(path.join(__dirname + "/T&C.html"));
});
router.get("/privacy_policy", function (req, res) {
  res.sendFile(path.join(__dirname + "/privacyPolicy.html"));
});

module.exports = router;
