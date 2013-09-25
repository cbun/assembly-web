'use strict';

app.directive("arLib", function() {
  return {
    restrict: "E",
    scope: {
    	libdata: "="
    },
    templateUrl: "templates/seqLibraryWidget.html",
  }
});



app.directive('arLogin', function() {
    return {
        restrict: 'A',
        controller: 'LoginCtrl',
        link: function(scope, element, attrs) {
            $(element).kbaseLogin({style: 'slim',
            	login_callback: function() {
            		var user = $(element).kbaseLogin('session', 'user_id');
            		var token = $(element).kbaseLogin('session').token;
            		scope.setLoggedIn(user, token);
            	}});
        }
    };
}); 

