const express = require("express");
const router = express.Router();
const { AdminController } = require("../controllers");

router.post("/login", AdminController.POST_adminLogin);
router.post("/forgetPassword", AdminController.POST_forgetPassword);
router.post("/changePassword", AdminController.POST_changePassword);
router.get("/stats", AdminController.GET_adminStats);
router.get("/getAllUsers", AdminController.GET_allUsers);
router.get("/getAllBrands", AdminController.GET_allBrands);
router.post("/addBrandUser", AdminController.POST_addBrandUser);
router.post("/delete/users", AdminController.POST_deleteUsers);

module.exports = router;
