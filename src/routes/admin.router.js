const express = require("express");
const router = express.Router();
const { AdminController } = require("../controllers");

router.post("/login", AdminController.POST_adminLogin);
router.post("/forgetPassword", AdminController.POST_forgetPassword);
router.post("/changePassword", AdminController.POST_changePassword);
router.get("/stats", AdminController.GET_adminStats);
router.get("/getAllUsers", AdminController.GET_allUsers);
router.get("/getAllBrands", AdminController.GET_allBrands);
router.get("/get/UserDetails", AdminController.GET_userDetails);
router.post("/addBrandUser", AdminController.POST_addBrandUser);
router.post("/add/user", AdminController.POST_addNewUser);
router.post(
  "/remove/user/closetItem",
  AdminController.POST_removeUserClosetItem
);
router.post(
  "/remove/user/outfitItem",
  AdminController.POST_removeUserOutfitItem
);
router.post("/add/product", AdminController.POST_addProduct);
router.get("/get/brandProducts", AdminController.GET_getBrandProducts);
router.post("/delete/users", AdminController.POST_deleteUsers);
router.post("/delete/brands", AdminController.POST_deleteBrands);

module.exports = router;
