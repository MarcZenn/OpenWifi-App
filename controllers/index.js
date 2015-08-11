var indexController = {
	index: function(req, res) {
		res.render('index');
	},

	templates : function(req,res) {
		res.render(req.params.template)
	},

	successLogin: function(req, res) {
		res.send(req.user);
	}
	
	



	
};

module.exports = indexController;