require('dotenv').config();

// 로그인 되어 있는 유저일 경우 Error를 반환한다.
module.exports = (req, res, next) => {
  try {
    const cookies = /**req.headers[process.env.cookie_name] ||*/ req.cookies[process.env.COOKIE_NAME];
    if (cookies) {
      return res.status(403).send({
        errorMessage: '이미 로그인이 되어있습니다.',
      });
    }

    next();
  } catch (error) {
    console.log(error)
    return res.status(400).send({
      errorMessage: '잘못된 접근입니다.',
    });
  }
};
