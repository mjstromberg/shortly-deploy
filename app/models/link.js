var db = require('../config');
var crypto = require('crypto');

var linkSchema = db.Schema({
  url: 'string',
  baseUrl: 'string',
  code: 'string',
  title: 'string',
  visits: 'number',
  link: 'string'
});

var Link = db.model('Link', linkSchema);

var createSha = function(url) {
  var shasum = crypto.createHash('sha1');
  shasum.update(url);
  return shasum.digest('hex').slice(0, 5);
};

linkSchema.pre('save', function(next, link) {
  this.code = createSha(this.url);
  next();
});

module.exports = Link;
