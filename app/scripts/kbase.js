'use strict';

// (function() {
// 	$('#signin').kbaseLogin();
// 	}(jQuery));


app.factory('kbaseSessionService', ['webStorage',
		function(webStorage){
			var isLoggedIn = false;	
			var arToken;
			var arUser;

			return {
				checkSession: function(){
					var session = webStorage.session.get('kbase_session');
                    if (session != undefined){ // Session info exists
                    	console.log('exists!');
                    	this.setLoggedIn(session.user_id, session.token);
                    	return true;
                    } else{
                    	return false;
                    }

				},
				clearSession: function(){
					webStorage.session.clear();
					isLoggedIn = false;
				},
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
	}}]);