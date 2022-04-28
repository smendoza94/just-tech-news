const User = require('./User');
const Post = require('./Post');

// create a "one to many relation" user to post association
User.hasMany(Post, {
  foreignKey: 'user_id'
});

// create a "one to one relation" post to user association
Post.belongsTo(User, {
  foreignKey: 'user_id',
});

module.exports = { User, Post };