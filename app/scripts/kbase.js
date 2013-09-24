'use strict';

// (function() {
// 	$('#signin').kbaseLogin();
// 	}(jQuery));


app.provider('kbaseSessionService', [
		function(){
			var isLoggedIn = false;	
			var arToken;
			var arUser;

			if (arToken && arUser) {
				isLoggedIn = true;
			}
			return {
				$get: function(){
					return {
						getUser: function(){
							return arUser;
						},
						getToken: function(){
							return arToken;
						},
						isLoggedIn: function(){
							return isLoggedIn;
						},
						setToken: function(token){
							//arToken = $("#signin").kbaseLogin('session').token;
							arToken = token;
						},
						setUser: function(user){
							arUser = user;
						},
						setLoggedIn: function(user, token){
							arUser = user;
							arToken = token;
							isLoggedIn = true;
							console.log('Logged in');
							console.log("kbaseSession: " + arUser);
							console.log("kbaseSession: " + arToken);
						}
	}}}}]);