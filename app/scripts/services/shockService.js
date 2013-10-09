//Return promises!
// For REST calls to Shock
angular.module('assemblyNgApp').
	factory('shockService', ['$q', 'kbaseSessionService', 'arastRestService', 'Restangular', 
		function($q, $kbaseSessionService, arastRestService, Restangular){
			var user = kbaseSessionService.getUser();
			var token = kbaseSessionService.getToken();

			return {
				updateNode: function(node, attr) {
					console.log();
				}
			};
};