const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const { User, Post } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/', async (req, res, next) => {  // GET /user
  try {
    if (req.user) {
      const user = await User.findOne({
        where: { id: req.user.id }
      });
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ['password']
        },
        include: [{
          model: Post,
          attributes: ['id'],
        }, {
          model: User,
          as: 'Followings',
          attributes: ['id'],
        }, {
          model: User,
          as: 'Followers',
          attributes: ['id'],
        }]
      })
      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {  // POST /user/login
  // 미들웨어 확장
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error(err);
      return next(error);
    }
    if (info) {
      // 401 : 허용 되지 않음
      return res.status(401).send(info.reason);
    }

    return req.login(user, async (loginErr) => {
      // passport 에러
      if (loginErr) {
        return next(loginErr);
      }
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        attributes: {
          exclude: ['password']
        },
        include: [{
          model: Post,
        }, {
          model: User,
          as: 'Followings',
        }, {
          model: User,
          as: 'Followers',
        }]
      })
      return res.status(200).json(fullUserWithoutPassword);
    })
  })(req, res, next);
});

router.post('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.status(200).send('ok');
});

router.post('/', isNotLoggedIn, async (req, res, next) => {  // POST /user/
  try {
    // 기존 사용자 찾기
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      }
    });
    if (exUser) {
      return res.status(403).send('이미 사용중인 이메일 입니다.');
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);  // 두번째 인수는 10~13의 숫자를 넣어준다 (수가 클수록 보안이 올라감)
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });

    res.setHeader
    // 200 : 성공
    // 201 : 잘 생성됨
    res.status(201).send('ok');
  } catch (error) {
    console.error(error);
    next(error);  // status 500
  }
});

module.exports = router;