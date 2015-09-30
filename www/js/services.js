angular.module('starter.services', ['firebase'])
//
.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    var ref = new Firebase("https://amanchat.firebaseio.com/");
    return $firebaseAuth(ref);
  }
])

//class factory
.factory('Class',['$firebaseArray','AuthFactory',function($firebaseArray,AuthFactory){
    var ref = new Firebase("https://amanchat.firebaseio.com/class");

//downloading server data into local sync object via $firebaseArray;
//we can use $firebaseObject instead of $firebaseArray.
    var classData =$firebaseArray(ref);


    var factory = {
         getClasses: function(){
           return classData;
         },
         getById: function(classId){

           for(var i=0;i<classData.length;i++){
             if(classData[i].id===parseInt(classId)){
               return classData[i];
             }
           }
            return null;
         },

         getFavClass: function(userId){
           var favRef = new Firebase("https://amanchat.firebaseio.com/users"+userId+"/favClass");
           return $firebaseArray(favRef);
         }

 /*
         addToFavClass: function(favclass,userId){
             var refFav = new Firebase("https://amanchat.firebaseio.com/users/"+userId+"/favClass");
            return $firebaseArray(refFav);
         }
         */

    };

    return factory;//returning the factory object

}])

//Ionic loading factory
.factory('Loader', ['$rootScope','$ionicLoading', '$timeout',
      function($rootScope,$ionicLoading, $timeout) {

        var LOADERAPI = {
          showLoading: function(text){
            text = text || 'Loading...';
            $ionicLoading.show({
              template:text
            });
          },

          hideLoading:function(){
            $ionicLoading.hide();
          },

          toggleLoadingWithMessage: function(text, timeout){
          var self=this;
          self.showLoading(text);

            $timeout(function(){
              self.hideLoading();
            },timeout || 3000);
          }
        };
        return LOADERAPI;
      }
])

//localStorage factory
//this is to get more efficiency and battery saving
.factory('LSFactory', [function(){

  var LSAPI = {

     clear: function(){
        return localStorage.clear();
     },

     get: function(key){
        return JSON.parse(localStorage.getItem(key));
     },

     set: function(key,data){
       return localStorage.setItem(key,JSON.stringify(data));
     },

     delete: function(key){
       return localStorage.removeItem(key);
     },

     getAll: function(){
       var classes = [];
       var items = Object.keys(localStorage);//we use Object.keys method to convert the localStorage(array-like)object into an array.

       //iterating
       for(var i=0; i<items.length;i++){
         if(items[i]!=='user' || items[i]!='token'){
            classes.push(JSON.parse(localStorage[items[i]]));
         }
       }
       return classes;
     }
  };
  return LSAPI;
}])

/*
Authentication factory using 'LSFactory' as dependency
This factory is dependent on LSFactory and manages the user authentication data.
As mentioned earlier, when the user does a login or register, the server will send an
access token along with a user object. These wrapper methods save the user data and
token data in local storage using the LSFactory API.
*/

.factory('AuthFactory',['LSFactory', function(LSFactory){

  var userKey = 'user';
  var tokenKey = 'token';

  var AuthAPI = {

     isLoggedIn: function(){
       return this.getUser()===null?false:true;
     },
     //setting user into LocalStorage using LSFactory set method
     setUser:function(user){
       return LSFactory.set(userKey,user);
     },

     getUser: function(){
       return LSFactory.get(userKey);
     },

     setToken: function(token){
         return LSFactory.set(tokenKey,token);
     },

     getToken:function(){
        return LSFactory.get(tokenKey);
     },

     deleteAuth: function(){
       LSFactory.delete(userKey);
       LSFactory.delete(tokenKey);
     }
  };
  return AuthAPI;
}])

//TokenInterceptor factory
//to manipulate the http request and response and changing the config object header
.factory('TokenInterceptor', ['$q','AuthFactory', function($q,AuthFactory){
    var TokenInterceptorAPI = {

      request:function(config){
        config.headers = config.headers || {};
            var token = AuthFactory.getToken();
            var user = AuthFactory.getUser();

            if (token && user) {
              config.headers['X-Access-Token'] = token.token;
              config.headers['X-Key'] = user.email;
              config.headers['Content-Type'] ="application/json";
            }
        return config || $q.when(config);
      },

      response: function(response){
        return response || $q.when(response);
      }
    };
    return TokenInterceptorAPI;
}])
