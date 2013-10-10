//Return promises!
// For REST calls to Shock
angular.module('assemblyNgApp').
	factory('shockService', ['$q', '$http', 'kbaseSessionService', 'arastRestService', 'Restangular', 
		function($q, $http, kbaseSessionService, arastRestService, Restangular){
			var user = kbaseSessionService.getUser();
			var token = kbaseSessionService.getToken();
			var shockUrl;
			arastRestService.getShockUrl().then(function(url){
				shockUrl = url;
			});
			return {
				updateNode: function(node, attr) {
					attr['user'] = user;
					console.log(attr)
					var aFileParts = [ JSON.stringify(attr) ];
					console.log(aFileParts);
					var oMyBlob = new Blob(aFileParts, { "type" : "text\/json" });
					var fd = new FormData();
					fd.append('attributes', oMyBlob);
					console.log(fd)
					// $http.put('http://' + shockUrl + '/node/' + node, fd).success(function(res){
						$http.put('http://' + shockUrl + '/node/' + node, fd, {
							transformRequest: function(data) { return data; }
						}).success(function(res){
					});

				}
			};
		}]);