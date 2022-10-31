const express = require("express");
const router = express.Router();

const MatchController = require("../controllers/match");
const matchController = new MatchController();
const authMiddleware = require("../middlewares/auth-middleware");

router.get("/match/host", authMiddleware, matchController.matchLeader);

module.exports = router;