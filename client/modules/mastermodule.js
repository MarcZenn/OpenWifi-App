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
		});

	$routeProvider 
		.when('/search', {
			templateUrl : '/views/search',
			controller  : 'searchController'
		});


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
	}


});


// Reviews Factory

// masterModule.factory('reviewFactory', function($resource, $http) {

// 	var model = $resource('api/posts/:username') 


// 	return {
// 		model : model, 
// 		posts : posts
// 	}
// })





// Authentication/Login/Signup controller

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
		
		$scope.userContainer.user = authUser;

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



// Profiles Controller 

masterModule.controller('profileController', function($scope, $http, $resource, $location, authUser, $routeParams, userFactory) {

	$scope.userContainer = authUser;


	$scope.profileUser = userFactory.model.get({ username : $routeParams.username } ) // $routeparams comes from front end routing. 

	$scope.editing = false

	$scope.onEditing = function() {
		$scope.editing = true 

	};


	$scope.submitToServer = function() {
		console.log("this is front end scope", $scope.profileUser)
		userFactory.model.save($scope.profileUser)

		$scope.editing = false
	};

	// Handles the hiding/showing of review buttons/forms.
	$scope.submittingReview = false 

	// form data function below grants me the person who received the review. 
	$scope.reviewFormData = {}
	
	$scope.onReview = function() {

		$scope.submittingReview = true

		$scope.reviewFormData.postedOn = $scope.profileUser

		console.log($scope.reviewFormData)

		console.log($scope.profileUser._id)

	}

	$scope.submitReview = function() {

		$scope.reviewFormData.postedOn = $scope.profileUser._id


		$http.post('/api/reviews', $scope.reviewFormData).

			then(function(response) {
				console.log(response)

			}, function(response){
				console.log(response)
			});
	}




});


// Search Controller. 

masterModule.controller('searchController', function($scope, $http, $resource, $location, authUser, $routeParams) {

	$scope.userContainer = authUser;

	$http.get('/api/allUsers').
		then(function(returnData){
			$scope.profiles = returnData.data
		});


});



// Review Controller - handles submitting review

// masterModule.controller('reviewController', function($scope, $http, $resource, $location, authUser, $routeParams, reviewFactory) {
// 	$scope.userContainer = authUser;

// 	$scope.submitReview = function() {

// 		$http.post('/api/reviews', $scope.reviewFormData).

// 			then(function(response) {
// 				console.log(response)

// 			}, function(response){
// 				console.log(response)
// 			});
// 	}

// });



