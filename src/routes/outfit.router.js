const express = require("express");
const router = express.Router();
const { OutfitController } = require("../controllers");

router.post("/createOutfit", OutfitController.POST_createOutfit);
router.post("/removeOutfitItem", OutfitController.POST_removeOutfitItem);
router.post("/findOutfitList", OutfitController.POST_findOutfitList);
router.get("/getOutfitDetails", OutfitController.GET_getOutfitDetails);
router.post("/getOneOutfitDetails", OutfitController.POST_getOneOutfitDetails);

module.exports = router;
