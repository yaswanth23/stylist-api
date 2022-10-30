const express = require("express");
const router = express.Router();
const { OtpController, AuthController } = require("../controllers");

router.post("/signUp", AuthController.POST_signUp);
router.post("/login", AuthController.POST_login);
router.post("/sendOtp", OtpController.POST_sendOtp);
router.post("/verifyOtp", OtpController.POST_verifyOtp);

module.exports = router;
