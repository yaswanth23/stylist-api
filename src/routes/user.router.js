const express = require("express");
const router = express.Router();
const { UserController } = require("../controllers");

router.get("/getUserDetails", UserController.GET_userDetails);
router.post("/userProfile", UserController.POST_userProfile);

module.exports = router;
