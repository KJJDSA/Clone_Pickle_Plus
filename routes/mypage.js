const express = require("express");
const router = express.Router();
const passport = require('passport');
const MyPageController = require("../controllers/mypage");
const myPageController = new MyPageController();

router.get("/account", myPageController.lookupMyBankAccount);
router.put("/account", myPageController.updateBankAccount);

module.exports = router;