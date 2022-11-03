const express = require("express");
const router = express.Router();

const MyPartyController = require("../controllers/myparty");
const myPartyController = new MyPartyController();
const authMiddleware = require("../middlewares/authmiddleware");

// 전체 파티 정보 불러오기
router.get("/", authMiddleware, myPartyController.lookupMyParty);

// 특정 파티 정보 불러오기
router.get("/:partyId", authMiddleware, myPartyController.findOneParty);

// OTT 정보 수정하기
router.put("/:partyId", authMiddleware, myPartyController.changePartyInfo);

router.delete("/:partyId", authMiddleware, myPartyController.exitParty)

module.exports = router;
