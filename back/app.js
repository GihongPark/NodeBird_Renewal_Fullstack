// const http = require('http');  // node로 서버 구현을 위한 모듈

// const server = http.createServer((req, res) => {
//   console.log(req.url, req.method);
//   res.end('Hello node');
// });

// server.listen(3065, () => {
//   console.log('서버 실행 중');
// });


// express로 서버 구현하기
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');

const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const hashtagRouter = require('./routes/hashtag');
const db = require('./models');
const passportConfig = require('./passport');

dotenv.config();
const app = express();
// sequelize 설정 후 db 생성
// $ npx sequelize db:create
db.sequelize.sync()
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch(console.error);
passportConfig();

app.use(morgan('dev'));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,  // 쿠키 전달을 위한 설정
}));

// localhost:3065/~
app.use('/', express.static(path.join(__dirname, 'uploads')));
// 프론트에서 받은 데이터를 req.body안에 넣어주는 역할을 한다
// 라우터보다 위에있어야함
app.use(express.json());  // json 데이터
app.use(express.urlencoded({ extended: true }));  // urlEncoded 방식(form-data로 보낼때)
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  saveUninitialized: false,
  resave: false,
  secret: process.env.COOKIE_SECRET,
}));
app.use(passport.initialize());
app.use(passport.session());

// app.get : 가져오기
// app.post : 생성하기
// app.put : 전체수정(덮어씌우기)
// app.patch : 부분수정
// app.delete : 삭제하기
// app.options : 요청가능한지 찔러보기
// app.head : 헤더정보만 가져오기
app.get('/', (req, res) => {
  res.send('hello express');
});

app.use('/post', postRouter); // '/post'가 프리픽스로 붙는다
app.use('/posts', postsRouter);
app.use('/user', userRouter);
app.use('/hashtag', hashtagRouter);


// 에러처리 미들웨어 
// 미들웨어 마지막 직전에 위치(app.listen 직전)
app.use((err, req, res, next) => {

});

app.listen(3065, () => {
  console.log('서버 실행 중!');
});