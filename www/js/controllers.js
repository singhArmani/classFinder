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

.controller('MainLMCtrl', [function( Loader, $ionicPlatform,
$cordovaOauth,FBFactory, currentAuth, $state){
  console.log("I am MainCtrl");

//  $state.go('main');

}])

//Register Controller
.controller('RegisterVMCtrl', ["Auth","$firebaseArray",
function(Auth,$firebaseArray){
  var vm = this;
   vm.createUser = function(){
     vm.message = null;
     vm.error= null;
    // Auth.$createUser().then().catch();
    Auth.$createUser({
        email: vm.email,
        password: vm.password
      }).then(function(userData) {
        vm.message = "User created with uid: " + userData.uid;
         //console.log($scope.email)
        //creating a ref to our database
        var ref = new Firebase("https://amanchat.firebaseio.com/");

        var usersRef = ref.child("users");
        vm.users = $firebaseArray(usersRef);

        vm.users.$add({
             email:vm.email,
             full_name:"",
             phone_number:""
        });
      }).catch(function(error) {
      vm.error = error;
      });
   };

}])
