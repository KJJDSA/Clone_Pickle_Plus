const jwt = require("jsonwebtoken");
const { Users } = require("../models");
require('dotenv').config();

module.exports = (req, res, next) => {
  try {

    const accesstoken = req.headers[process.env.cookie_name] || req.cookies[process.env.COOKIE_NAME];

    if (!accesstoken) {
      // return res.redirect('/api/auth/kakao') // 봉인 카카오 로그인
      return res.status(400).json({ message: '로그인이 필요합니다' })
    }
    const [authType, authToken] = (accesstoken).split(" ");

    if (!authToken || authType !== "Bearer") throw { message: "옳지 않은 접근입니다." }

    // res.locals.authToken = authToken;
    // console.log(authToken)
    const { userId } = jwt.verify(authToken, process.env.SECRET_KEY);
    // console.log(userId)
    Users.findOne({ where: { userId } }).then((user) => {
      res.locals.user = user;
      // console.log(user)
      next();
    });
  } catch (error) {
    res.status(401).send({
      errorMessage: error.message
    });
  }
};