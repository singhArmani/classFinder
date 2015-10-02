angular.module('starter.controllers', ['starter.services'])

.controller('DashCtrl', function($scope) {})

//FavouritesCtrl
.controller('FavouritesCtrl',function($scope,Class,AuthFactory){

  var userId=null;
  $scope.userloggedIn = null;
  //implementing listerner when user logged in
  $scope.$on('GetFavClassesForUser',function(){
  console.log("I am listening for the GetFavClassesForUser");
    //using scope property
     $scope.favoritesClasses = Class.getFavClass(userId);
     console.log($scope.favoritesClasses);
  });

  //getting the user status
  if(!AuthFactory.isLoggedIn()){
    console.log("user not logged in ");
     $scope.userloggedIn=false;
    //use broadcast on $rootScope for 'showLoginModal'
  }
  else{
    userId= AuthFactory.getUser();
    $scope.userloggedIn=true;
    console.log("user logIn with userId: "+ AuthFactory.getUser());
    $scope.$broadcast('GetFavClassesForUser'); }//otherwise broadcast


})



//classController
.controller('ClassCtrl', function($scope, Class,Loader){

 Loader.showLoading("Fetching Classes...");
  $scope.classes = Class.getClasses(); //asking factory to provide class detail here
 console.log($scope.classes);
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

  var userId = AuthFactory.getUser();

  //getting a reference to the fav classes
  var favClasses = Class.getFavClass(userId);
  console.log("the favclass lenght is "+favClasses.length);

  //adding listener on our broadcast
  $scope.$on('addToFavClass', function(){

  Loader.showLoading('Adding to favourites..');

//call back method upon successfully added to favourites
      var onComplete = function(error) {
      if (error) {
        console.log('Synchronization failed');
      } else {
        Loader.hideLoading();
        Loader.toggleLoadingWithMessage('Successfully added ' + $scope.classDetail.title + ' to your favourites', 1500);

        console.log('Synchronization succeeded');
      }
    };
//callback method finish

      var favClassexist = false;

      for(var i=0;i<favClasses.length;i++){
        if(favClasses[i].id===$scope.classDetail.id){
          console.log("looprunning");
          Loader.hideLoading();
          Loader.toggleLoadingWithMessage('Classes Already In Your favourites', 1000);
          console.log("this class already exist");
          favClassexist=true;
           break;
        }
      }

      //setting only when there's no duplicacy
    var favRef = new Firebase("https://amanchat.firebaseio.com/users/"+userId+"/favClass");
     if(!favClassexist){
      favRef.push().set({
        description: $scope.classDetail.description,
        id: $scope.classDetail.id,
        image:$scope.classDetail.image,
        price:$scope.classDetail.price,
        title:$scope.classDetail.title
      },onComplete);
      }

   });


  //adding addToFavClass function on $scope
  $scope.addToFavClass= function(){
   if(!AuthFactory.isLoggedIn()){
     console.log("user not logged in !");
     Loader.toggleLoadingWithMessage("User not logged in!!",500);
     //use broadcast on $rootScope for 'showLoginModal'
   }
   else{
     console.log("user logIn with userId: "+ AuthFactory.getUser());
     $scope.$broadcast('addToFavClass'); }//otherwise broadcast
  };



})


//AccountCtrl
.controller('AccountCtrl', function($scope,$state,AuthFactory) {

var al = this;
al.userId= AuthFactory.getUser();
   //getting the user status via AuthFactory
   //getting the user status
   if(!AuthFactory.isLoggedIn()){
     console.log("user not logged in ");
      al.loggedIn=false;
       console.log(al.userId);
     //use broadcast on $rootScope for 'showLoginModal'
   }
   else{
     al.loggedIn=true;
   }

  //doing the logout
   al.logout= function(){
    var ref = new Firebase("https://amanchat.firebaseio.com/");
     ref.unauth();
     AuthFactory.deleteAuth();
     $state.go('main');
   };


})

//AccountDetailCtrl
.controller('AccountDetailCtrl',function($scope,$state,Loader,AuthFactory,$firebaseArray){

var adl = this;


  var refClass = new Firebase("https://amanchat.firebaseio.com/class");
  var totalClasses = $firebaseArray(refClass);
  console.log(totalClasses);

  //grabbing data from input field

  //starts----->
  adl.addClass= function()
  {
  Loader.showLoading('Adding Classes..');

//call back method upon successfully added to favourites
      var onComplete = function(error) {
      if (error) {
        console.log('Synchronization failed');
      } else {
        Loader.hideLoading();
        Loader.toggleLoadingWithMessage('Successfully added ', 1500);
        adl.classImage="";
        adl.classTitle="";
        adl.classBookingPrice="";
        adl.classDescription="";
        adl.classId="";
        $state.go('tab.account');

        console.log('Synchronization succeeded');
      }
    };
//callback method finish

      var favClassexist = false;

      for(var i=0;i<totalClasses.length;i++){
        if(adl.classId===totalClasses[i].id){
          console.log("looprunning");
          Loader.hideLoading();
          Loader.toggleLoadingWithMessage('Classes With id '+adl.classId+' Already Exist ', 1000);
          console.log("this class already exist");
          favClassexist=true;
           break;
        }
      }

      //setting only when there's no duplicacy
     if(!favClassexist){
      refClass.push().set({
        description: adl.classDescription,
        id: adl.classId,
        image:adl.classImage,
        price:adl.classBookingPrice,
        title:adl.classTitle
      },onComplete);
      }
  };

  //ends--->


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
  /*
  lm.skip= function(){
    $state.go('tab.dash');
  }
*/

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
