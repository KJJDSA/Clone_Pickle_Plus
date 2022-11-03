const UserService = require('../services/user');
const Joi = require('joi');

const re_nickname = /^[a-zA-Z0-9]{3,10}$/;
const re_password = /^[a-zA-Z0-9]{4,30}$/;
const re_phone = /^[0-9]{10,15}$/;

const userSchema = Joi.object({
  nickname: Joi.string().pattern(re_nickname).required(),
  password: Joi.string().pattern(re_password).required(),
  confirm: Joi.any().valid(Joi.ref('password')),
  phone: Joi.string().pattern(re_phone)
});

const loginSchema = Joi.object({
  nickname: Joi.string().required(),
  password: Joi.string().required(),
});

class UserController {
  userService = new UserService();

  postSignup = async (req, res, next) => {
    try {
      const { nickname, password, confirm, phone } = await userSchema.validateAsync(req.body);
      if (password !== confirm) {
        return res.status(412).send({
          errorMessage: '패스워드 확인이 일치하지 않습니다.',
        });
      }

      if (password.search(nickname) !== -1) {
        return res.status(412).send({
          errorMessage: '패스워드에 닉네임이 포함되어 있습니다.',
        });
      }

      const existUsers = await this.userService.findSameNickname({ nickname });

      if (existUsers) {
        return res.status(412).send({ errorMessage: '중복된 닉네임 입니다.' });
      } else {
        const createdUser = await this.userService.createUser({ nickname, password, phone });

        res.status(201).send({ message: '회원 가입에 성공하였습니다.', data: createdUser });
      }
    } catch (error) {
      const message = `${req.method} ${req.originalUrl} : ${error.message}`;
      console.log(message);
      res.status(400).json({ message });
    }
  };

  postLogin = async (req, res, next) => {
    try {
      let { nickname, password } = await loginSchema.validateAsync(req.body);

      const { token, expires } = await this.userService.loginUser({ nickname, password });

      res.cookie(process.env.COOKIE_NAME, `Bearer ${token}`, { expires: expires });

      return res.status(200).json({ token });
    } catch (error) {
      if (error.code === -1) {
        res.status(401).send({ errorMessage: '닉네임 또는 패스워드가 틀렸습니다.' });
      } else {
        console.log(error);
        return res.status(400).send({
          errorMessage: '로그인에 실패하였습니다.',
        });
      }
    }
  };
}

module.exports = UserController;
