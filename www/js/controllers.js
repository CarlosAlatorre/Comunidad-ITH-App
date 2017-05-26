angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopup, $timeout) {

	// With the new view caching in Ionic, Controllers are only called
	// when they are recreated or on app start, instead of every page change.
	// To listen for when this page is active (for example, to refresh data),
	// listen for the $ionicView.enter event:
	//$scope.$on('$ionicView.enter', function(e) {
	//});

	// Form data for the login modal
	$scope.loginData = {};

	// Create the login modal that we will use later
	$ionicModal.fromTemplateUrl('templates/login.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modal = modal;
	});

	// Triggered in the login modal to close it
	$scope.closeLogin = function() {
		$scope.modal.hide();
	};

	// Open the login modal
	$scope.login = function() {
		$scope.modal.show();
	};

	// Perform the login action when the user submits the login form
	$scope.doLogin = function() {
		console.log('Doing login', $scope.loginData);

		// Simulate a login delay. Remove this and replace with your login
		// code if using a login system
		$timeout(function() {
		  $scope.closeLogin();
		}, 1000);
	};

	// popup of logout
	$scope.infoApp2 = function() {
		var alertPopup = $ionicPopup.alert({
			template: '<center>You are going out!!</center>',
			buttons: [
				{
					text: 'Ok',
					type: 'button-dark'
				}
			]
		});
		alertPopup.then(function(res) {
			console.log('Out!!');
		});
	};

})

.controller('NewsCtrl',function($scope, $location, $ionicModal,  $timeout, $firebaseArray, $firebaseObject, $rootScope){
	var vm = this;
	vm.currentNew = null;
	//public functions
	vm.openNew = openNew;
	vm.openComments = openComments;
	vm.like = like;
	vm.sendComment = sendComment;
	//Private functions
	function activate(){
		  var ref = firebase.database().ref().child('news');
		// download the data into a local object
		vm.news = $firebaseArray(ref);

		$timeout(function(){
			var currentUser = firebase.auth().currentUser;
			var ref = firebase.database().ref().child('users/' + currentUser.uid);
			vm.currentUser = $firebaseObject(ref);
		}, 1000);
	}
	activate();
	function openNew(newO){
		vm.currentNew = newO;
		if(!vm.currentNew.likes){
			vm.currentNew.likes = [];
			vm.currentNew.iLiked = false;
		}else{
			vm.currentNew.iLiked = vm.currentNew.likes.indexOf(vm.currentUser.userId) != -1;
		}
		var ref = firebase.database().ref().child('contents/' + newO.$id);
		// download the data into a local object
		var syncObject = $firebaseObject(ref);
         syncObject.$bindTo($scope, "content");
		$scope.modal.show();
	}
	function openComments(){
		var ref = firebase.database().ref().child('comments/' + vm.currentNew.$id);
		vm.comments = $firebaseArray(ref);
		$timeout(function(){
			var elem = document.getElementById('comments');
			elem.scrollTop = elem.scrollHeight;
		},4000)
		$scope.modalComments.show();
	}

	$scope.closeComment = function() {
		$scope.modalComments.hide();
	};

	// Create the login modal that we will use later
	$ionicModal.fromTemplateUrl('templates/newDetails.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});
	$ionicModal.fromTemplateUrl('templates/comments.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modalComments = modal;
	});

	// Triggered in the login modal to close it
	$scope.closeNew = function() {
		$scope.modal.hide();
	};

	function like(){
		if(vm.currentNew.likes){
			var index = vm.currentNew.likes.indexOf(vm.currentUser.userId);
			if(index != -1){
				vm.currentNew.likes.splice(index, 1);
			}else{
				vm.currentNew.likes.push(vm.currentUser.userId);
			}
		}else{
			vm.currentNew.likes = [];
			vm.currentNew.likes.push(vm.currentUser.userId);
		}
		firebase.database().ref('news/' + vm.currentNew.$id).update({
			likes: vm.currentNew.likes
		});
		if(!vm.currentNew.likes){
			vm.currentNew.likes = [];
			vm.currentNew.iLiked = false;
		}else{
			vm.currentNew.iLiked = vm.currentNew.likes.indexOf(vm.currentUser.userId) != -1;
		}
	}

	function sendComment(){
		if(vm.messageToSend && vm.messageToSend != ""){
			firebase.database().ref('comments/' + vm.currentNew.$id).push({
				image: vm.currentUser.profilePicture ? vm.currentUser.profilePicture: '',
				message: vm.messageToSend,
				name: vm.currentUser.username,
				createdDate: new Date().getTime()
			});
			vm.messageToSend = "";
		}
	}

})

.controller('MenuActiveCtrl', function($scope, $location, $timeout, $state,  $firebaseObject) {
    var vm = this;
	vm.signOut = signOut;

	//Private function
	function activate(){
		$timeout(function(){
			var currentUser = firebase.auth().currentUser;
			var ref = firebase.database().ref().child('users/' + currentUser.uid);
			vm.currentUser = $firebaseObject(ref);
		}, 1000);
	
	}
	activate();

	$scope.isActive = function(route) {
        return route === $location.path();
    };
	function signOut(){
		firebase.auth().signOut().then(function() {
			// Sign-out successful.
			$state.go('login');
		}, function(error) {
			// An error happened.
		});
	}
})
.controller('EventsCtrl', function($scope, $location) {
    $scope.isActive = function(route) {
        return route === $location.path();
    };
})
.controller('loginCtrl', function($scope, $state) {
	var vm = this;

	//public functions
	vm.singInWithFacebook = singInWithFacebook;
	vm.signInWithEmail = signInWithEmail;

	//Private functions
	function activate(){
	}
	activate();

	function signInWithEmail(){
		firebase.auth().signInWithEmailAndPassword(vm.email, vm.password).then(function(response){
			$state.go('app.news');
		})
		.catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			// ...
			vm.password = "";
		});
	}

	function singInWithFacebook(){
		var provider = new firebase.auth.FacebookAuthProvider();
		firebase.auth().signInWithPopup(provider).then(function(result) {
			// This gives you a Facebook Access Token. You can use it to access the Facebook API.
			var token = result.credential.accessToken;
			// The signed-in user info.
			var user = result.user;
			$state.go('app.news')
			registerUser();
		}).catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			// The email of the user's account used.
			var email = error.email;
			// The firebase.auth.AuthCredential type that was used.
			firebase.database().ref('/errors').push(error);
			var credential = error.credential;
		});
		// firebase.auth().signInWithRedirect(provider);
		// firebase.auth().getRedirectResult().then(function(result) {
		// 	if (result.credential) {
		// 		// This gives you a Facebook Access Token. You can use it to access the Facebook API.
		// 		var token = result.credential.accessToken;
		// 		// ...
		// 	}
		// 	// The signed-in user info.
		// 	var user = result.user;
		// 	$state.go('app.news')
		// }).catch(function(error) {
		// 	// Handle Errors here.
		// 	var errorCode = error.code;
		// 	var errorMessage = error.message;
		// 	// The email of the user's account used.
		// 	var email = error.email;
		// 	// The firebase.auth.AuthCredential type that was used.
		// 	var credential = error.credential;
		// 	// ...
		// });
	}

	function registerUser(){
		var currentUser= firebase.auth().currentUser;
		var user = {};
		 firebase.database().ref('/users/' + currentUser.uid).once('value').then(function(snapshot) {
			user.username = snapshot.val().username;
			return user;
		}).catch(function(response){
			writeUserData(currentUser.uid, currentUser.displayName, currentUser.email, currentUser.photoURL);
		});
		
	}

	function writeUserData(userId, name, email, imageUrl) {
		firebase.database().ref('/users/' + userId).set({
			userId: userId,
			username: name,
			email: email,
			profilePicture : imageUrl
		});
	}

	function createNewNews(title, coverImage, activeComments, by, createdDate, tags){
		firebase.database().ref('/news').push({
			title: title,
			coverImage: coverImage,
			activeComments: activeComments,
			by: by,
			createdDate: createdDate,
			tags: tags
		});
	}
	// createNewNews("TECNM PRESENTA EMBLEMA DE IDENTIDAD CON ÁGUILA REAL", "https://firebasestorage.googleapis.com/v0/b/comunidad-ith-c9124.appspot.com/o/2.JPG?alt=media&token=c72d95d5-ee05-4ec8-a08d-5ed398529a74", true, "Difusion", new Date(), {sistemas: true});
	// createNewNews("TIENE ITH ‘MUJERES SONORENSES DE 100’", "https://firebasestorage.googleapis.com/v0/b/comunidad-ith-c9124.appspot.com/o/4.JPG?alt=media&token=b055e89b-1858-406a-b7ab-d7b59211647b", true, "Difusion", new Date(), {sistemas: true});
	// createNewNews("PRESENTA ITH SU PROGRAMA DE POSGRADOS", "https://firebasestorage.googleapis.com/v0/b/comunidad-ith-c9124.appspot.com/o/3.JPG?alt=media&token=f8d40ad1-137f-4b07-8c54-6aec4d312b64", true, "Difusion", new Date(), {sistemas: true});
	
});


