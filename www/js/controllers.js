angular.module('starter.controllers', ['starter.services'])

.controller('DashCtrl', function($scope) {})

/*.controller('ChatsCtrl', function($scope, Chats) {
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
*/

//classController
.controller('ClassCtrl', function($scope, Class){
  $scope.classes = Class.getClasses(); //asking factory to provide class detail here
  console.log("the lenth of array is "+$scope.classes.length);
})

.controller('ClassDetailCtrl', function($scope, $stateParams, Class,Loader) {
  var classId = $stateParams.classId;
  $scope.classDetail = Class.getById($stateParams.classId);



})


.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})


.controller('MainLMCtrl', ['$state','AuthFactory','Loader','$rootScope',function($state,AuthFactory,Loader,$rootScope){
  console.log("I am MainCtrl");
 var lm = this;
  //creating a ref to our database
  var ref = new Firebase("https://amanchat.firebaseio.com/");


//do some validation here using simple firebase API(without $firebaseAuth)
  lm.validate=function(){
      Loader.showLoading('Authenticating...');
      ref.authWithPassword({
        email: lm.email,
        password:lm.password
         }, function(error, authData) {
           if (error) {
              lm.loginError=error.code;
             console.log("Login Failed!", lm.error);
             Loader.hideLoading();
           } else {
            Loader.hideLoading();
   console.log("Authenticated successfully with payload:", authData);
      $rootScope.name= authData.password.email;
       $state.go('tab.dash');

   }
     });
  };


}])


//Register Controller
.controller('RegisterVMCtrl', ["Auth","$firebaseArray","Loader",
function(Auth,$firebaseArray,Loader){
  var vm = this;
   vm.createUser = function(){
     Loader.showLoading('Registering...');
     vm.message = null;
     vm.error= null;
    // Auth.$createUser().then().catch();
    Auth.$createUser({
        email: vm.email,
        password: vm.password
      }).then(function(userData) {
        Loader.hideLoading();
        console.log(userData);
        vm.message = "User created with uid: " + userData.uid ;
        var ref = new Firebase("https://amanchat.firebaseio.com/");
    // save the user's profile into the database so we can list users,
    // use them in Security and Firebase Rules, and show profiles
    ref.child("users").child(userData.uid).set({
      email: vm.email,
      fullName: "",
      phone:"",
      favClass:""
    });

      }).catch(function(error) {
        Loader.hideLoading();
      vm.error = error;
      });
   };

}])
