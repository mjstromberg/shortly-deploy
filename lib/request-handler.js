var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find({})
    .then(function(links) {
      res.status(200).send(links);
    })
    .catch(function(err) {
      res.status(500).send('Error: Couldn\'t retrive links!');
    });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }

  Link.findOne({url: uri})
    .then(function(link) {
      if (link) {
        res.status(200).send(link);
      } else {
        util.getUrlTitle(uri, function(err, title) {
          if (err) {
            console.log('Error reading URL heading: ', err);
            return res.sendStatus(404);
          }
          Link.create({
            url: uri,
            title: title,
            baseUrl: req.headers.origin
          }, function(err, newLink) {
            if (err) {
              return res.sendStatus(404);
            } else {
              res.status(200).send(newLink);
            }
          });
        });
      }
    });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username })
    .then(function(user) {
      if (!user) {
        res.redirect('/login');
      } else {
        User.comparePassword(password, user.password, function(err, match) {
          if (match) {
            util.createSession(req, res, user);
          } else {
            res.redirect('/login');
          }
        });
      }
    });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username })
    .then(function(existingUser) {
      if (existingUser) {
        res.redirect('/signup');
      } else {
        User.create({
          username: username,
          password: password
        }, function(err, newUser) {
          util.createSession(req, res, newUser);
        });
      }
    });
};

exports.navToLink = function(req, res) {
  Link.findOne({ code: req.params[0] })
    .then(function(link) {
      if (!link) {
        res.redirect('/');
      } else {
        link.visits++;
        link.save(function(err, savedLink) {
          return res.redirect(link.url);
        });
      }
    });
};
