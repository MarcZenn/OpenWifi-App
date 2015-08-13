var masterModule = angular.module('masterModule', ['ngResource', 'ngRoute', 'profileModule' ])

// in here you simply need to handle you login routes. The reference to profilemodule as a dependency will handle grabbing the data
// for each user and filling out the profile. 


// when someone hits '/' put this into ng-view along with controller. 
masterModule.config(function($routeProvider){

	$routeProvider
		// this route is activated by a login button that redirects to /login.
		.when('/', {
			// templateURL is injected whereever ng-View directive is present in markup.
			templateUrl : '/views/home', 
			// this is the frontend controller that grabs the data from the back-end controller and 
			// is sent along with the template to append data and handle behavior etc!
			controller  : 'profileController' 
		});

	// because route is dynamic on backend this front end route still uses a param to send template. 
	$routeProvider
		// this route is activated by a login button that redirects to /login.
		.when('/login', {
			// templateURL is injected whereever ng-View directive is present in markup.
			templateUrl : '/views/login', 
			controller  : 'loginController' 
		});
	// this will add in template url after data has been sent back from the controller which got its data from the factory and & back
	// end route. 
	$routeProvider
		.when('/profile/:username', { // why use a dynamic route here to render ones profile via the url?
			templateUrl : '/views/profile',
			controller  : 'profileController'
		})


});





// this Factory makes sure we are STILL logged in every time we navigate to a new page or leave the page and come back. 
// Authenctication factory. 
masterModule.factory('authUser', function($resource, $http){

	var userContainer = {user : null}

	var loginCheck = $http.get('/api/me').then(function(response) {
		userContainer.user = response.data;
	})

	
	return userContainer 


});

// User grab factory injected into profileController
masterModule.factory('userFactory', function($resource, $http){

	var model = $resource('/api/profiles/:username', {username : '@username'})

	
	return {
		model : model,
		// profiles : model.query() // sends a request to /api/profiles 
	}


});








masterModule.controller('loginController', function($scope, $http, $resource, $location, authUser){

	$scope.userContainer = authUser;

	//function below uses http.post to receive form data from the passport back end which is the user's data.  
	$scope.loginUser = function() {

 		$http.post('/login', $scope.formdata).
  			then(function(response) {
  				if (response.err) {
  					console.log("bad login boy:", response.err)
  				}
  				else { 
  					authUser.user = response.data
  					$location.path('/profile/' + response.data.username)
  				}
  		}, function(response) {
    		console.log(response.data)
  		});

	};

	//function below uses http.post to receive form data from the passport back end which is the user's data. 
	$scope.registerUser = function() {
		
 		$http.post('/signup', $scope.formdata).
  			then(function(response) {
  				authUser.user = response.data.data; 
  				$location.path('/profile/' + response.data.username)
  			
  		}, function(response) {
    		console.log(response.err)
  		});

	}, 

	$scope.logoutUser = function () {
		$http.post('/logout').
			then(function(repsonse) {
				$location.path('/login')
				authUser.user = null;
		}, function(reponse) {
			console.log(response.err)
		});
	}

	

});



// Profile Controller - Handles binding the users data to the users profile! 
masterModule.controller('profileController', function($scope, $http, $resource, $location, authUser, $routeParams, userFactory) {
	$scope.userContainer = authUser;


	$scope.profileUser = userFactory.model.get({ username : $routeParams.username } ) // $routeparams comes from front end routing. 

})






