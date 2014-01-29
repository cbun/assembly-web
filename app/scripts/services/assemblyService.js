'use strict';
// This service is for building jobs for submission
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
				data: {

					stagedLibraries:[],
					fileUrls: []

				},
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
				setPipeline: function(pipeline, names) {
					//set names to true if the pipeline is strings
					// names: false | null if module objects
					var i;
					arRequest.pipeline = [];
					for (i=0;i<pipeline.length;i++){
						if (names){
							arRequest.pipeline.push(pipeline[i]);
						} else {
							arRequest.pipeline.push(pipeline[i].name);
						}
					}
					console.log('setpipe');
					console.log(arRequest.pipeline);
				},
				submitRequest: function() {
					var arSubmitUrl = Restangular.one('user', user).one('job');
					arSubmitUrl.post('new', arRequest, {}, {
						"Authorization": "OAuth " + token
					}).then(function(data){
						alert("Job submitted: " + data);
						// Reset records
						var arRequest = {
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
					});

				}
			};
		}]);



//Return promises!
// For REST calls to arast
angular.module('assemblyNgApp').
	factory('arastRestService', ['$q', 'kbaseSessionService', 'Restangular', 
		function($q, kbaseSessionService, Restangular){
			var user = kbaseSessionService.getUser();
			var token = kbaseSessionService.getToken();

			// Routes
			var userStatusRoute = Restangular.one('user', user).one('job', 'status');
			var jobRoute = Restangular.one('user', user).one('job');
			var shockRoute = Restangular.one('shock/');

			// Storage
			var statusAll; 
			var arShockUrl;
			var arModules;
			var arRecipes = [
  			  {"name": "Auto", "pipeline": ["kiki"]}, 
			  {"name": "SuperDuper", "pipeline": ["bhammer", "spades", "sspace"]}];

			return{
				getStatusAll: function(doRefresh) {
					var deferred = $q.defer();
					if (statusAll == undefined || doRefresh){
						console.log('Retrieving latest status');
						userStatusRoute.get({"format": "json"}).then(function(data){
							statusAll = data;
							deferred.resolve(statusAll);
						});
					} else {
						deferred.resolve(statusAll);
					}
					return deferred.promise;
				},
				getJobInfo: function(job_id) {
					var deferred = $q.defer();
					jobRoute.one(job_id, 'status').get({'format': 'json'}).then(function(data){
							var jobInfo = data;
							deferred.resolve(jobInfo);
						});
					return deferred.promise;
				},
				getFiles: function(filetype) {
					var deferred = $q.defer();
					this.getShockUrl().then(function(shockUrl){

						var shockreq = "http://" + shockUrl ;
						var shockQuery = Restangular.oneUrl('', shockreq);
						shockQuery.getList("node", {"querynode": "blank", 
							                        "attributes.filetype": filetype, 
							                        "attributes.user": user}, {}).then(
							function(shockres){
								deferred.resolve(shockres)
							})
					});
					return deferred.promise;
				},
				getRecipes: function(doRefresh) {
					var deferred = $q.defer();
					if (arRecipes == undefined || doRefresh){
						console.log("recipe");

						//TODO call server
						deferred.resolve(arRecipes);
					} else {
						deferred.resolve(arRecipes);	
					}
					return deferred.promise;
				},
				getArModules: function(doRefresh) {
					var deferred = $q.defer();
					if (arModules == undefined || doRefresh){
						console.log('Getting latest modules');
					}
				},
				getShockNodes: function(job_id){

					// Return all the shock node ids from a single Job

					var deferred = $q.defer();
					jobRoute.one(job_id, "shock_node").get().then(function(data){
						deferred.resolve(data);	
					});
					return deferred.promise;
				},
				getShockUrl: function(doRefresh){

					// Return the URL of the Shock storage server

					var deferred = $q.defer();
					if (arShockUrl == undefined || doRefresh){
						shockRoute.get().then(function(data){
							console.log(data)
							arShockUrl = data.shockurl;
							deferred.resolve(arShockUrl);
						})
						
					} else {
						deferred.resolve(arShockUrl);	
					}
					return deferred.promise;
				},
				killJob: function(job_id) {
					var deferred = $q.defer();
					jobRoute.one(job_id, "kill").get({},{"Authorization": "OAuth " + token}).then(function(data){
						deferred.resolve(data);							
					});
					return deferred.promise;

				}
			}
		}]);



