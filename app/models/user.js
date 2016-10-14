var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var hashPassword = function(user) {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(user.password, null, null)
    .then(function(hash) {
      user.password = hash;
    });
};

var userSchema = new db.Schema({
  username: {
    type: 'string',
    require: true
  },
  password: {
    type: 'string',
    require: true
  }
});

userSchema.pre('save', function(next) {
  hashPassword(this)
    .then(function() {
      next();
    });
});

var User = db.model('User', userSchema);

User.comparePassword = function(attemptedPassword, savedPassword, callback) {
  bcrypt.compare(attemptedPassword, savedPassword, function(err, isMatch) {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

module.exports = User;
