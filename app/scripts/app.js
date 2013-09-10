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

app.config(function(RestangularProvider){
  RestangularProvider.setBaseUrl("http://140.221.84.203:8000/");
});
