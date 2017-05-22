// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'firebase'])

.run(function($ionicPlatform) {
  	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
		  	cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
		  	// org.apache.cordova.statusbar required
		  	StatusBar.styleDefault();
		}
  	});
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
	$ionicConfigProvider.navBar.alignTitle('center');
  	$stateProvider

  	.state('app', {
		url: "/app",
		abstract: true,
		templateUrl: "templates/menu.html",
		controller: 'AppCtrl',
		resolve: {
			isAutenticate: isAutenticate
		}
  	})

  	.state('app.news', {
		url: "/news",
		views: {
			'menuContent': {
				templateUrl: "templates/news.html",
				controller: 'NewsCtrl as vm'
	  		}
		}
 	})
  	.state('app.profile', {
		url: "/profile",
		views: {
	  		'menuContent': {
				templateUrl: "templates/profile.html"
	  		}
		}
  	})
	.state('app.events', {
		url: "/events",
		views: {
			'menuContent': {
				templateUrl: "templates/events.html",
				controller: 'EventsCtrl as vm'
	  		}
		}
 	})
	 .state('app.newDetails', {
		url: "/newDetails",
		views: {
			'menuContent': {
				templateUrl: "templates/newDetails.html",
				controller: 'newDetailsCtrl as vm'
	  		}
		}
 	})
	 .state('app.notice', {
		url: "/notice",
		views: {
			'menuContent': {
				templateUrl: "templates/notice.html"
	  		}
		}
 	})
	  .state('login', {
		url: "/login",
		templateUrl: "templates/login.html",
		controller: 'loginCtrl as vm',
		resolve: {
			isAutenticate: function($state){
		  firebase.auth().onAuthStateChanged(function(user) {
				if (user) {
					$state.go('app.news');
				}
			});
	  }
		}
 	})

  	// if none of the above states are matched, use this as the fallback
  	$urlRouterProvider.otherwise('/login');

	   function isAutenticate($state){
		  firebase.auth().onAuthStateChanged(function(user) {
				if (!user) {
					// No user is signed in.
					$state.go('login');
				}
			});
	  }

});
