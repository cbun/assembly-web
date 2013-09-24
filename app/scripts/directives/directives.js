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
        link: function(scope, element, attrs) {
            $(element).kbaseLogin({style: 'button',
            	login_callback: function() {
            		console.log('logged in!');
            		var user = $(element).kbaseLogin('session', 'user_id');
            		var token = $(element).kbaseLogin('session').token;
            		scope.setLoggedIn(user, token)
            	}});
        }
    };
}); 

