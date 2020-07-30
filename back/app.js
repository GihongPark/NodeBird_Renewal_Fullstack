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
const postRouter = require('./routes/post');
const db = require('./models');

const app = express();
// sequelize 설정 후 db 생성
// $ npx sequelize db:create
db.sequelize.sync()
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch(console.error);

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

app.get('/posts', (req, res) => {
  res.json([
    { id: 1, content: 'hello' },
    { id: 2, content: 'hello2' },
    { id: 3, content: 'hello3' },
  ]);
});

app.use('/post', postRouter); // '/post'가 프리픽스로 붙는다

app.listen(3065, () => {
  console.log('서버 실행 중!');
});