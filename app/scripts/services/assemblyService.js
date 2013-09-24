'use strict';

angular.module('assemblyNgApp').
	factory('arastService', ['Restangular', 'kbaseSessionService',
		function(Restangular, kbaseSessionService) {
			var user = kbaseSessionService.getUser();
			var token = kbaseSessionService.getToken();
			var arRequest = {
//				"ARASTUSER": user,
				"data_id": null, 
				"file_sizes": [], 
				"filename": [], 
				"ids": [], 
				"message": null, 
				"pipeline": [['kiki']], 
				"queue": null, 
				"single": [[]],
				"pair": [],
				"reference": null, 
				"version": "webclient"};

			return {
				setValue: function(key, value){
					arRequest[key] = value;
				},
				formArRequest: function(shockObjs, pipeline) {
					var arastMsgTemplate = {
						"pipeline": ''
					};
					return 'shockObjs';
				},
				getArRequest: function() {
					return arRequest;
				},
				addSingle: function(single) {
					arRequest.single[0].push(single.file.name);
					arRequest.filename.push(single.file.name);
					arRequest.file_sizes.push(single.file.size);
					arRequest.ids.push(single.id);
				},
				addLib: function(lib) {
					var i;
					var fileSet = [];
					for (i=0;i<lib.shockObjs.length;i++){
						fileSet.push(lib.shockObjs[i].file.name);
						arRequest.filename.push(lib.shockObjs[i].file.name);
						arRequest.file_sizes.push(lib.shockObjs[i].file.size);
						arRequest.ids.push(lib.shockObjs[i].id);
					}
					if (lib.shockObjs.length == 2) {
						arRequest.pair.push(fileSet);
					}else {
						arRequest.single[0] = arRequest.single[0].concat(fileSet);
					}
				},
				setPipeline: function(pipeline) {
					var i;
					arRequest.pipeline = [];
					for (i=0;i<pipeline.length;i++){
						arRequest.pipeline.push(pipeline[i].name);
					}
				},
				submitRequest: function() {

					var arSubmitUrl = Restangular.one('user', user).one('job');
					arSubmitUrl.post('new', arRequest, {}, {
						"Authorization": "OAuth " + token
					}).then(function(data){
						alert("Job submitted: " + data);
					});

				}
			};
		}]);




angular.module('assemblyNgApp').
	factory('arastRestService', ['kbaseSessionService', 'Restangular', 
		function(kbaseSessionService, Restangular){
			var user = kbaseSessionService.getUser();
			var token = kbaseSessionService.getToken();
			var userRoute = Restangular.one('user', user).one('job', 'status');
			return{
				getStatusAll: function() {
					return userRoute.get()
				}
			}

	}]);



