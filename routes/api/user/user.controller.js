var
  async                     = require('async'),
  _                         = require('lodash'),
  validator                 = require('validator'),
  md5                       = require('md5'),
  User                      = require('./user.model'),
  helpers                   = require('../helpers'),
  authenticationController  = require('../authentication/authentication.controller');

var controller = {

  getById: function (req, res) {
    let userID = req.params.id;

    if(!userID){
      helpers.badRequest(res, 'Missing user id param');
    }

    User.findOne({
      '_id': req.params.id
    }).then(function (user) {
    
      delete user.email;
      delete user.number;

      res.status(200).json(user);
    }, function(err){
      helpers.badRequest(res, err.message);
    });
  },

  login: function (req, res) {
    let input = req.body.input;
    let isEmail = validator.isEmail(input);
    let isNumber = validator.isMobilePhone(input, 'en-IN');
    let passwordHash = md5(req.body.password.toString());

    let __queryPayload = {};

    if(isEmail){
      __queryPayload.email = input;
    } else if(isNumber){
      __queryPayload.number = input;
    }

    if(!isEmail && !isNumber){
      return helpers.badRequest(res, 'Please enter a valid email or number');
    }

    User.findOne(__queryPayload).then(function(user){
      if(user){
        if(user.password.toString() === passwordHash.toString()){
          res.status(200).send(_.omit(user, ['salt', 'password']));  
        } else {
          return helpers.badRequest(res, 'Password entered is incorrect');
        }
        
      } else {
        return helpers.badRequest(res, 'User is not registered');
      }

    }, function(err){
      helpers.badRequest(res, err.message);
    });
  },

  create: function (req, res) {

    // Delete isVerified and active key if present in request
    delete req.body.isNumberVerified;
    delete req.body.isEmailVerified;

    User.findOne({
      'email': req.body.email
    }).then(function (usr) {
      
      if (usr) {
        return helpers.badRequest(res, 'User is already registered');
      } else {

        User.create(req.body).then(function (user) {
          return res.status(201).json(user);
        }, function(err){
          helpers.badRequest(res, err.message);
        });

      }
    }, function(err){
      helpers.badRequest(res, err.message);
    });
  },

  update: function (req, res) {
    if (req.user.id == res.body.id) {
      
      // req.user is the present state of the user object
      req.body = _.merge(req.user, req.body);

      User.findOne({
        '_id': req.user.id
      }).then(function(user){
        user = _.extend(user, req.body);
        user.save();
        res.status(200).json(user);

      }, function(err){
        helpers.badRequest(res, err.message);
      });
    } else {
      return helpers.permissionDenied(res);
    }
  }
}

module.exports = controller;