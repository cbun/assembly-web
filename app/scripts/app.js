'use strict';

var app = angular.module('assemblyNgApp', ['ngResource', 'ngRoute','ngCookies', 'ui.bootstrap', 
  'ngDragDrop', 'ngGrid', 'restangular', 'webStorageModule', 'blueimp.fileupload', 'frapontillo.bootstrap-switch']);

// Routing
app.config(function ($routeProvider) {
    $routeProvider
      // .when('/', {
      //   templateUrl: 'views/dashboard.html',
      //   controller: 'DashboardCtrl',
      //   access: {
      //     isFree: false
      //   }
      // })
      .when('/dashboard', {
        name: "dashboard",
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl',
        access: {
          isFree: false
        },
        resolve: {
//          init: statusCtrl
        }

      })
      .when('/pipeline', {
        templateUrl: 'views/main.html',
        controller: 'UserFileCtrl',
        access: {
          isFree: false
        }
      })
      .when('/upload', {
        templateUrl: 'partials/uploader.html',
        access: {
          isFree: false
        }
      })
      .when('/quick', {
        templateUrl: 'partials/uploader.html',
        access: {
          isFree: false
        }
      })
      .when('/job/:id', {
        templateUrl: 'views/job.html',
        access: {
          isFree: true
        }
      })
      .when('/login/:redirect', {
        name: 'login',
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl',
        access: {
          isFree: true
        }
      })
      .when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl',
        access: {
          isFree: true
        }
      })
      .when('/welcome/', {
        templateUrl: 'views/welcome.html',
        access: {
          isFree: true
        }
      })
      .otherwise({
        redirectTo: '/welcome/'
      });
  });

// CORS support
app.config(['$httpProvider', function($httpProvider) {
        delete $httpProvider.defaults.headers.common["X-Requested-With"];
        delete $httpProvider.defaults.headers.common["Origin"];
        delete $httpProvider.defaults.headers.put["Content-Type"];
      }]);


// app.config(function($sceDelegateProvider) {
//   $sceDelegateProvider.resourceUrlWhitelist(['.*']);
// });



// Restangular config
app.config(function(RestangularProvider){
  RestangularProvider.setBaseUrl("http://140.221.84.203:8000/");
 // RestangularProvider.setDefaultHeaders();

  RestangularProvider.setResponseExtractor(function(response, operation, what, url) {
        // Extract data objects from shock node
        if (what === "node") {
            var newResponse = response.data;
            return newResponse;
        }
        return response;
    });
});

//Blueimp
app.config(['$httpProvider', 'fileUploadProvider',
            function ($httpProvider, fileUploadProvider) {
                delete $httpProvider.defaults.headers.common['X-Requested-With'];
                fileUploadProvider.defaults.redirect = window.location.href.replace(
                    /\/[^\/]*$/,
                    '/cors/result.html?%s'
                );
            }
        ]);


        
