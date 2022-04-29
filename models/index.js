const User = require('./User');
const Post = require('./Post');
const Vote = require('./Vote');

// create a "one to many relation" User to Post association
User.hasMany(Post, {
  foreignKey: 'user_id'
});

// create a "one to one relation" Post to User association
Post.belongsTo(User, {
  foreignKey: 'user_id',
});

// "many to many relation" User to Votes to Posts- user can vote many times and votes can belong to many posts
User.belongsToMany(Post, {
  through: Vote,
  as: 'voted_posts',
  foreignKey: 'user_id'
});

Post.belongsToMany(User, {
  through: Vote,
  as: 'voted_posts',
  foreignKey: 'post_id'
});

module.exports = { User, Post, Vote };