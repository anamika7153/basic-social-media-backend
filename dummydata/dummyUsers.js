const bcrypt = require('bcrypt');

const dummyUsers = [
  { name: "Katherine Pierce", email: 'user1@example.com', password:'password1', id: "1", followers: 1, followings: 2},
  { name: "John Doe", email: 'user2@example.com', password:'password2', id: "2", followers: 1, followings: 2},
  { name: "Arshad Warsi", email: 'user3@example.com', password:'password3', id: "3", followers: 1, followings: 2},
];

module.exports = dummyUsers;
