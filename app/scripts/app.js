'use strict';

var app = angular.module('assemblyNgApp', ['ngResource', 'ngCookies', 'ui.bootstrap', 
  'ngDragDrop', 'ngGrid', 'restangular', 'webStorageModule', 'blueimp.fileupload', 'frapontillo.bootstrap-switch']);

// Routing
app.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'UserFileCtrl',
        access: {
          isFree: false
        }
      })
      .when('/dashboard', {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl',
        access: {
          isFree: false
        }

      })
      .when('/status', {
        templateUrl: 'partials/statusAll.html',
        access: {
          isFree: false
        }
      })
      .when('/login', {
        templateUrl: 'partials/login.html',
        access: {
          isFree: true
        }
      })
      .otherwise({
        redirectTo: '/dashboard'
      });
  });

// CORS support
app.config(['$httpProvider', function($httpProvider) {
        delete $httpProvider.defaults.headers.common["X-Requested-With"];
        delete $httpProvider.defaults.headers.common["Origin"];
        console.log($httpProvider.defaults.headers.common);
      }]);

// Restangular config
app.config(function(RestangularProvider){
  RestangularProvider.setBaseUrl("http://140.221.84.203:8000/");
  RestangularProvider.setDefaultHeaders();

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
                console.log('config');
                fileUploadProvider.defaults.redirect = window.location.href.replace(
                    /\/[^\/]*$/,
                    '/cors/result.html?%s'
                );
            }
        ]);

        
