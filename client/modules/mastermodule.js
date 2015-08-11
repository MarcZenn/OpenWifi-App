var masterModule = angular.module('masterModule', ['ngResource', 'ngRoute', 'profileModule' ])

// in here you simply need to handle you login routes. The reference to profilemodule as a dependency will handle grabbing the data
// for each user and filling out the profile. 


// when someone hits / put this into ng-view along with controller. 
masterModule.config(function($routeProvider){

	$routeProvider
		// this route is activated by a login button that redirects to /login.
		.when('/', {
			// templateURL is injected whereever ng-View directive is present in markup.
			templateUrl : '/views/home', 
			// this is the frontend controller that grabs the data from the back-end controller and 
			// is sent along with the template to append data and handle behavior etc!
			controller  : '' 
		});

	// because route is dynamic on backend this front end route still uses a param to send template. 
	$routeProvider
		// this route is activated by a login button that redirects to /login.
		.when('/login', {
			// templateURL is injected whereever ng-View directive is present in markup.
			templateUrl : '/views/login', 
			controller  : 'loginController' 
		});

});


masterModule.factory('profileFactory', function($resource){

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



masterModule.controller('loginController', function($scope, $http, $resource){

	console.log("error")

	$scope.loginUser = function() {

 		$http.post('/login', $scope.formdata).
  			then(function(response) {
  		}, function(response) {
    		console.log(response.data)
  		});

	};

	$scope.registerUser = function() {
		console.log("error")
 		$http.post('/signup', $scope.formdata).
  			then(function(response) {
    		console.log(response)
  		}, function(response) {
    
  		});

	} 

	







});


