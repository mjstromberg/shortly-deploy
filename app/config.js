var path = require('path');
var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://localhost/shortly');

module.exports = db;
