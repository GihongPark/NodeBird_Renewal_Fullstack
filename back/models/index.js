const Sequelize = require('sequelize');
const comment = require('./comment');
const hashtag = require('./hashtag');
const image = require('./image');
const post = require('./post');
const user = require('./user');

// 환경변수를 env에 담는다(기본값: 'development')
const env = process.env.NODE_ENV || 'development';
// config.json에서 환경변수에 맞는 정보를 가져온다.
const config = require('../config/config')[env];
const db = {};

// sequelize가 node와 mysql을 연결해줌
const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.Comment = comment;
db.Hashtag = hashtag;
db.Image = image;
db.Post = post;
db.User = user;
// db.Comment = require('./comment')(sequelize, Sequelize);
// db.User = require('./user')(sequelize, Sequelize);
// db.Post = require('./post')(sequelize, Sequelize);
// db.Image = require('./image')(sequelize, Sequelize);
// db.Hashtag = require('./hashtag')(sequelize, Sequelize);

Object.keys(db).forEach(modelName => {
  db[modelName].init(sequelize);
})

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);  // 각 모델(테이블)의 associate 부분 연결
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
