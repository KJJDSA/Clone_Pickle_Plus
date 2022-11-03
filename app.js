const express = require("express");
const session = require("express-session");
const app = express();
const Http = require("http");
const http = Http.createServer(app);
require("dotenv").config();
const port = process.env.EXPRESS_PORT;
const routes = require('./routes');
const passport = require('passport');
const passportConfig = require('./passport');
// const bodyParser = require("body-parser") // 그냥 express.json해도 똑같다
const cookieParser = require('cookie-parser');


app.use(cookieParser());
// app.use(cookieParser(process.env.COOKIE_NAME));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_NAME,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);
app.use(passport.initialize());

passportConfig();
const cors = require("cors");

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.js');
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// 세개 다 라우터 미들웨어 아래에 있길래 위로 올림
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

app.use('/api', routes);



// app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.get("/", (req, res) => {
  res.send("hello world!");
});

const jwt = require("jsonwebtoken");
app.get("/token/:userId", (req, res) => {
  const userId = req.params;
  const token = jwt.sign({ userId }, process.env.SECRET_KEY);
  const expires = new Date();
  expires.setMinutes(expires.getMinutes() + 600);
  res.cookie(process.env.COOKIE_NAME, `Bearer ${token}`, { expires: expires });
  res.send(token);
});

http.listen(port, () => {
  console.log(`${port}포트로 서버가 열렸습니당`);
});

module.exports = http;