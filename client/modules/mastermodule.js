var master = angular.module('masterModule', ['ngResource', 'ngRoute', 'profileModule' ])

// in here you simply need to handle you login routes. The reference to profilemodule as a dependency will handle grabbing the data
// for each user and filling out the profile. 


// when someone hits / put this into ng-view along with controller. 
master.config(function($routeProvider){
	$routeProvider
		// this route is activated by a login button that redirects to /login.
		.when('/', {
			// templateURL is injected whereever ng-View directive is present in markup.
			templateUrl : '/views/home', // this is the unique users profile that is injected when user visits profile: home/req.params
			// this is the frontend controller that grabs the data from the back-end controller and 
			// is sent along with the template to append data and handle behavior etc!
			controller  : 'controllerbelow' // what will this controller do on the profile?
		});

		// because route is dynamic on backend this front end route still uses a param to send template. 
	$routeProvider
		// this route is activated by a login button that redirects to /login.
		.when('/login', {
			// templateURL is injected whereever ng-View directive is present in markup.
			templateUrl : '/views/login', // this is the unique users profile that is injected when user visits profile: home/req.params
			// this is the frontend controller that grabs the data from the back-end controller and 
			// is sent along with the template to append data and handle behavior etc!
			controller  : 'controllerbelow' // what will this controller do on the profile?
		});

});


master.factory('profileFactory', function($resource){

	// This creates a $resource model
	// Our base URL is /api/animals with the option of additionally passing the /:id component
	// All the methods this $resource model uses will be in reference to those URLs
	var model = $resource('/api/profiles/:id', {id : '@_id'})
	// this._id
	// @_id

	// model.query() // GET - /api/animals
	// model.get()
	// model.$save() // POST - /api/animals
	// model.$delete()
	// model.get({id : ObjectId('5483292394823')}) // GET - /api/animals/5483292394823

	// Factories use the revealing module pattern, so we must return the relevant pieces of information
	return {
		model   : model,
		user : model.query() // GET - /api/animals  Should get all the animals in our DB
	}


});


master.controller('loginController', function($scope, $http, $resource){

	console.log(loginController);

	$scope.redirectLogout = function() {

		$http.post('views/login', {"hello world"}).
			
			then function(response) {
		}, 

		function(response) {

		}

}







});


