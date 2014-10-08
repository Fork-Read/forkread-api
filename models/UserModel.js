var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	name: String,
	email: String,
	contactNo: String,
	gender: String,
	currentLocation: String,
	books: Array
});

var UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;