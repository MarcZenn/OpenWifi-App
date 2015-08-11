var indexController = {
	index: function(req, res) {
		res.render('index');
	},

	templates : function(req,res) {
		res.render(req.params.template)
	},

	login: function(req, res) {
		res.render('login');
	}
	
	



	
};

module.exports = indexController;