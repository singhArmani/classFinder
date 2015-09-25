// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform,$rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }

/*
    //stateChangeError
    $rootScope.$on('$stateChangeError', function(event, toState,
      toParams, fromState, fromParams, error) {
      if (error === 'AUTH_REQUIRED') {
      $state.go('main');
      }
    });  */
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
//we will use $ionicConfigProvider to set up a few defaults.
$ionicConfigProvider.backButton.previousTitleText(false);
$ionicConfigProvider.views.transition('platform');
$ionicConfigProvider.navBar.alignTitle('center');

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  //setup the main page
  .state('main',{
    url:'/',
    templateUrl:'templates/main.html',
    controller:'MainCtrl',
    cache: false
  /*    resolve:{
      'currentAuth':['FBFactory', 'Loader', function(FBFactory,Loader){
        Loader.show('Checking Auth..');
        return FBFactory.auth().$waitForAuth();
      }]
    }*/
  })

  //register state
  .state('register',{
        url:'/register',
        templateUrl:'templates/register.html',
        controller:'RegisterCtrl'
      })

/*
    //login state
    .state('login',{
    url:'/login',
    templateUrl:'templates/login.html',
    controller:'LoginCtrl'
  })
  */

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    cache:false,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    },
    resolve:{
      'currentAuth':['FBFactory', 'Loader', function(FBFactory,Loader){
        Loader.show('Checking Auth..');
        return FBFactory.auth().$requireAuth();
      }]
    }
  })

  .state('tab.chats', {
      url: '/chats',
      cache:false,
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      },
      resolve:{
        'currentAuth':['FBFactory', 'Loader', function(FBFactory,Loader){
          Loader.show('Checking Auth..');
          return FBFactory.auth().$requireAuth();
        }]
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    },
    resolve:{
      'currentAuth':['FBFactory', 'Loader', function(FBFactory,Loader){
        Loader.show('Checking Auth..');
        return FBFactory.auth().$requireAuth();
      }]
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');

});
