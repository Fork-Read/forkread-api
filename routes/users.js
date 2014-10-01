var express = require('express');
var router = express.Router();
var UserModel = require('../models/UserModel');

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/:email', function(req, res) {
	var email = req.param('email');

	UserModel.findOne({email: email}, function(err, user) {
		if(err) {
			return console.error(err);
		}
		res.set('Content-Type', 'application/json');
		res.send(JSON.stringify(user));
	});
});

router.post('/save', function(req, res) {

	var email = req.body.email;

	if(email) {
		UserModel.findOne({email: email}, function(err, user) {
			if(err) {
				return console.error(err);
			}

			if(user) {
				console.log('existing user');
				res.set('Content-Type', 'application/json');
				res.send(JSON.stringify(user));
			}
			else {
				var newUser = new UserModel({
					name: req.body.name || '',
					email: req.body.email,
					contactNo: req.body.contactNo,
					gender: req.body.gender,
					currentLocation: req.body.currentLocation
				});

				console.log('new user');

				newUser.save(function(err, newUser) {
					if(err) {
						return console.error(err);
					}
					res.set('Content-Type', 'application/json');
					res.send(JSON.stringify(newUser));
				});
			}
		});
	}
});

module.exports = router;
