'use strict';

var app = angular.module('assemblyNgApp', ['ngResource', 'ui.bootstrap', 
  'ngDragDrop', 'ngGrid', 'restangular']);

app.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'UserFileCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

app.config(['$httpProvider', function($httpProvider) {
        delete $httpProvider.defaults.headers.common["X-Requested-With"]
      }]);

app.config(function(RestangularProvider){
  RestangularProvider.setBaseUrl("http://140.221.84.203:8000/");


  RestangularProvider.setResponseExtractor(function(response, operation, what, url) {
        // Extract data objects from shock node
        if (what === "node") {
            var newResponse = response.data;
            return newResponse;
        }
        return response;
    });
});
