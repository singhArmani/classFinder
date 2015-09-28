angular.module('starter.services', ['firebase'])
//
.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    var ref = new Firebase("https://amanchat.firebaseio.com/");
    return $firebaseAuth(ref);
  }
])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})
//Ionic loading factory
.factory('Loader', ['$ionicLoading', '$timeout',
      function($ionicLoading, $timeout) {

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
            $rootScope.showLoading(text);

            $timeout(function(){
              $rootScope.hideLoading();
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
