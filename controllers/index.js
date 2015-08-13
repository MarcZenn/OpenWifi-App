var User = require('../models/user')


var indexController = {
	index: function(req, res) {
		res.render('index', {user : req.user});
	},

	templates : function(req,res) {
		res.render(req.params.template, {user : req.user});
	},

	authenticate : function(req, res) {
		res.send(req.user);
	},

	getUser : function (req, res) {
		// notice the use of findOne to find only one. returns an object instead of an array
		User.findOne({username : req.params.username}, function(err, userData) {
			res.send(userData)
		})
	}



	
	



	
};

module.exports = indexController;