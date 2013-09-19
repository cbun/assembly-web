'use strict';

angular.module('assemblyNgApp').
	factory('arastService', ['Restangular', 'arastSessionService',
		function(Restangular, arastSessionService) {
			var user = arastSessionService.getUser();
			var token = arastSessionService.getToken();
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
						arRequest.pipeline.push(pipeline[i].name)
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
	factory('arastSessionService', function(){
		var arToken = "un=cbun|tokenid=87952b90-20ae-11e3-9f82-12313d2d6e7f|expiry=1411077972|client_id=cbun|token_type=Bearer|SigningSubject=https://nexus.api.globusonline.org/goauth/keys/87b98f58-20ae-11e3-9f82-12313d2d6e7f|sig=d3a9596bd298f79466406e94a5fa5c934e6a6a646b596c4ee395689059d71c0cd1bd6f9b827709f0d444708913d8644d039bb4385d7f542f719ff4a9564ac6ca6e18266611fe61a1c3c4518416177f67f7897c7765a6def60fd22ab02acfe92d67cdcc12568327968ce13473f56dc9b5c67f53b9e027a1f6da2213409ddf47d9";
		var arUser = "cbun";
		return {
			getUser: function(){
				return arUser;
			},
			getToken: function(){
				return arToken;
			}
		};
	});