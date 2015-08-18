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
	},

	updateUser : function (req,res) {
		console.log("tthis is server side: " , req.body)
		User.update({username : req.params.username}, req.body, function(err, userData) {
			console.log("successful database update")
		})
	}, 

	getAllUsers : function (req,res) {
		User.find({}, function(err, allUsers) {
			res.send(allUsers)
		})
	}, 

	createReview : function (req,res) {
		
		req.body.postedOn = req.body.postedOn._id;

			console.log(req.body)
		User.update({username: req.body.username}, {$push : {reviews: req.body}}, function(err, doc) {
			console.log(err, doc)
			res.send(doc);
			
		});
	}

	


	
	



	
};

module.exports = indexController;