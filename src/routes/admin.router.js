const express = require("express");
const router = express.Router();
const { AdminController } = require("../controllers");

router.post("/login", AdminController.POST_adminLogin);
router.post("/forgetPassword", AdminController.POST_forgetPassword);
router.post("/changePassword", AdminController.POST_changePassword);
router.get("/stats", AdminController.GET_adminStats);
router.get("/getAllUsers", AdminController.GET_allUsers);

module.exports = router;
