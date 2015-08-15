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
		var newReview = new reviewSchema ({

			title       : req.body.title,
  			createdBy   : req.user._id,
  			postedOn    : req.body.postedOn,
  			dateCreated : req.body.date,
  			body        : req.body.body
		}); 

		console.log(req.user._id)

		review.save(function(responseData) {
			console.log(responseData)
			res.send(responseData)
		})
	}, 

	getAllReviews : function (req, res) {
		User.reviewSchema.find({}, function(err, allReviews) {
			console.log(allReviews)
			res.send(allReviews)
		})
	}


	
	



	
};

module.exports = indexController;