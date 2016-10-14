var db = require('../config');
var crypto = require('crypto');

var linkSchema = new db.Schema({
  url: 'string',
  baseUrl: 'string',
  code: 'string',
  title: 'string',
  visits: 'number',
  link: 'string'
});

// linkSchema.on('init', function(model) {
//   var shasum = crypto.createHash('sha1');
//   console.log(model);
//   shasum.update(model.url);
//   model.code = shasum.digest('hex').slice(0, 5);
//   model.save();
// });

var createSha = function(url) {
  var shasum = crypto.createHash('sha1');
  shasum.update(url);
  return shasum.digest('hex').slice(0, 5);
};

linkSchema.pre('save', function(next, link) {
  this.code = createSha(this.url);
  next();
});

var Link = db.model('Link', linkSchema);

// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function() {
//     this.on('creating', function(model, attrs, options) {
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });

module.exports = Link;
