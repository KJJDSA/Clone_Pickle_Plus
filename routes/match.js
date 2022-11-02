const express = require("express");
const router = express.Router();

const MatchController = require("../controllers/match");
const matchController = new MatchController();
const authMiddleware = require("../middlewares/authmiddleware");

router.post("/leader", authMiddleware, matchController.matchLeader);

router.post("/member", authMiddleware, matchController.matchMember);

module.exports = router;
