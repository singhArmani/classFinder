angular.module('starter.controllers', ['starter.services'])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('MainCtrl', [function($scope, Loader, $ionicPlatform,
$cordovaOauth,FBFactory, currentAuth, $state){
  console.log("I am MainCtrl");
//  $state.go('main');

}])

//Register Controller
.controller('RegisterCtrl', ["$scope","Auth","$firebaseArray",
function($scope,Auth,$firebaseArray){
  console.log("I am RegisterCtrl");
   $scope.createUser = function(){
     $scope.message = null;
     $scope.error= null;
     $scope.reg="aman";
     console.log("this is :"+$scope.reg);
    // Auth.$createUser().then().catch();
    Auth.$createUser({
        email: $scope.email,
        password: $scope.password
      }).then(function(userData) {
        $scope.message = "User created with uid: " + userData.uid;
         //console.log($scope.email)
        //creating a ref to our database
        var ref = new Firebase("https://amanchat.firebaseio.com/");

        var usersRef = ref.child("users");
        $scope.users = $firebaseArray(usersRef);

        $scope.users.$add({
             email:$scope.email,
             full_name:"",
             phone_number:""
        });
      }).catch(function(error) {
        $scope.error = error;
      });
   };
}])

//login Controller
.controller('LoginCtrl',function($scope,$state,$firebaseObject,$firebaseAuth){

  //creating a ref to our database
  var ref = new Firebase("https://amanchat.firebaseio.com/");

  //download the data into a local object
    var $syncObject = $firebaseObject(ref);

  //sync the object with a three-way data-binding
  $syncObject.$bindTo($scope,"data");

//do some validation here using simple firebase API(without $firebaseAuth)
  $scope.validate=function(){

      ref.authWithPassword({
        email: $scope.email,
        password:$scope.password
         }, function(error, authData) {
           if (error) {
             console.log("Login Failed!", error);
           } else {
   console.log("Authenticated successfully with payload:", authData);
   //allow to go to app state
       $state.go('app');
   }
     });
  }
})
