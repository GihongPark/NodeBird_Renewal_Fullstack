const passport = require('passport');
const local = require('./local');
const { User } = require('../models');

module.exports = () => {
  // session 저장을 위해 user 정보에서 id만 저장
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // id를 통해 db에서 user정보 복구
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ where: { id }});
      done(null, user); // req.user
    } catch (error) {
      console.error(error);
      done(error);
    }
  });
  
  local();
}