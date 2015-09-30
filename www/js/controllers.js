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
.controller('ClassCtrl', function($scope, Class,Loader){

 Loader.showLoading("Fetching Classes...");
  $scope.classes = Class.getClasses(); //asking factory to provide class detail here

  $scope.classes.$loaded().then(function(x) {
    x === $scope.classes; // true
    Loader.hideLoading();
  })
  .catch(function(error) {
    Loader.hideLoading();
    console.log("Error:", error);
  });


  console.log("the lenth of array is "+$scope.classes.length);
})

//classDetail controller
.controller('ClassDetailCtrl', function($scope,$rootScope,Loader,$stateParams,LSFactory,Class,AuthFactory) {
  console.log($stateParams.classId);
  $scope.classDetail = Class.getById($stateParams.classId);

  //adding to fav
  $scope.$on('addToFavClass', function(){
  Loader.showLoading('Adding to Cart..');
  console.log("i am a listener");
  // Loader.showloading('Adding to favourites..');
      var userId = AuthFactory.getUser();

      var onComplete = function(error) {
      if (error) {
        console.log('Synchronization failed');
      } else {
        Loader.hideLoading();
        Loader.toggleLoadingWithMessage('Successfully added ' + $scope.classDetail.title + ' to your favourites', 2000);

        console.log('Synchronization succeeded');
      }
    };

      var ref = new Firebase("https://amanchat.firebaseio.com/");

      //checking no's of items in favClass
      var favClassArray = Class.getFavClass(userId);
    //  for(var i=0;)

      ref.child("users").child(userId).child("favClass").push().set({
        description: $scope.classDetail.description,
        id: $scope.classDetail.id,
        image:$scope.classDetail.image,
        price:$scope.classDetail.price,
        title:$scope.classDetail.title
      },onComplete);


    /*
     Class.addToFavClass($scope.classDetail,userId).success(function(data){

      // Loader.hideLoading();
      // Loader.toggleLoadingWithMessage('successfully added '+$scope.classDetail.title+' to your favourties',2000);
     }).error(function(err,statusCode){
    //   Loader.hideLoading();
      // Loader.toggleLoadingWithMessage(err.message);
     });

     */


   });


  //adding addToFavClass function on $scope
  $scope.addToFavClass= function(){
   if(!AuthFactory.isLoggedIn()){
     console.log("user not logged in "+AuthFactory.getUser());
     //use broadcast on $rootScope for 'showLoginModal'
   }
   else{
     console.log("user logIn with userId: "+ AuthFactory.getUser());
     $scope.$broadcast('addToFavClass'); }//otherwise broadcast
  };



})

/*
//AccountCtrl
.controller('favouritesCtrl',function(){

  //adding to fav
  $scope.$on('addToFavClass', function(){
  //  Loader.showloading('Adding to favourites..');
      var userId = AuthFactory.getUser();
     Class.addToFavClass($scope.classDetail,userId).success(function(data){

       Loader.hideLoading();
       Loader.toggleLoadingWithMessage('successfully added '+$scope.classDetail.title+' to your favourties',2000);
     }).error(function(err,statusCode){
       Loader.hideLoading();
       Loader.toggleLoadingWithMessage(err.message);
     });
   });
})
*/


/*
.controller('ClassDetailCtrl', ['Loader','$stateParams','Class','$scope','$rootScope',function($scope, $stateParams,$rootScope,Class,AuthFactory,Loader,LSFactory) {
  var classId = $stateParams.classId;
  $scope.classDetail = Class.getById(classId);

  //adding to fav
  $scope.$on('addToFavClass', function(){
    Loader.showloading('Adding to favourites..');
      var userId = AuthFactory.getUser();
     Class.addToFavClass($scope.classDetail,userId).success(function(data){

       Loader.hideLoading();
       Loader.toggleLoadingWithMessage('successfully added '+$scope.classDetail.title+' to your favourties',2000);
     }).error(function(err,statusCode){
       Loader.hideLoading();
       Loader.toggleLoadingWithMessage(err.message);
     });
   });

     //adding addToFavClass function on $scope
     $scope.addToFavClass= function(){
      if(!AuthFactory.isLoggedIn()){
        console.log("user not logged in");
        //use broadcast on $rootScope for 'showLoginModal'
      }
      else{
        console.log("user logIn with userId: "+ AuthFactory.getUser());
        $scope.$broadcast('addToFavClass'); }//otherwise broadcast
     };


}])

*/
//AccountCtrl
.controller('AccountCtrl', function($scope,$state,AuthFactory) {
  $scope.settings = {
    enableFriends: true
  };

  //doing the logout
   $scope.logout= function(){
var ref = new Firebase("https://amanchat.firebaseio.com/");
     ref.unauth();
     AuthFactory.deleteAuth();
     $state.go('main');
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
          //getting and saving that into our model
          $rootScope.name= authData.password.email;

          //setting our user using AuthFactory method
       AuthFactory.setUser(authData.uid);

          //setting the token here too
       AuthFactory.setToken(authData.token);

       $state.go('tab.dash');

   }
     });
  };
  lm.skip= function(){
    $state.go('tab.dash');
  }


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
