const express = require("express");
const router = express.Router();
const { OtpController, AuthController } = require("../controllers");

router.post("/login", AuthController.POST_login);
router.post("/sendOtp", OtpController.POST_sendOtp);
router.post("/verifyOtp", OtpController.POST_verifyOtp);
router.post("/deleteAccount", AuthController.POST_deleteAccount);

module.exports = router;
