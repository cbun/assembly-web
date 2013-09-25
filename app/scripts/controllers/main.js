'use strict';

angular.module('assemblyNgApp')
  .controller('UserFileCtrl', ['$scope', '$resource', 'Restangular', 'arastService', 'kbaseSessionService',
    function ($scope, $resource, Restangular, arastService, kbaseSessionService) {
        // Init

    $scope.arUser = kbaseSessionService.getUser();
    $scope.arToken = kbaseSessionService.getToken();
    $scope.stagedFilesFlat = [];
    $scope.stagedLibraries = [];
    $scope.libCount = 0;
    $scope.shockUrl = "";
    $scope.showPublicFiles = true;
    $scope.userFiles = [];

    //Navigation
    $scope.arStage = 1;
    $scope.nextStage = function(){
        $scope.arStage++;
    };

    $scope.stageFile = function(shockObjs){
    	//initial files
    	if ($scope.libCount == 0) {
    		$scope.addLibrary();
    	}
    	var lastLib = $scope.stagedLibraries.pop();
    	lastLib.shockObjs = lastLib.shockObjs.concat(shockObjs);
    	$scope.stagedLibraries.push(lastLib);
    };

    $scope.addLibrary = function(){
        $scope.libCount++;
    	var libname = "Library " + $scope.libCount;
    	var newLib = {name: libname,
    	              shockObjs: [],
                insert: null,
                stdev: null};
    	$scope.stagedLibraries.push(newLib);
    }

    //NG Grid for Shock files
    $scope.mySelections = []
    $scope.gridOptions = { 
        data: "userFiles",
        selectedItems: $scope.mySelections,
        columnDefs: [
          {field: "file.name", displayName: 'File Name'},
          {field: "file.size", displayName: "Size"}
        ]
	};


    //Pipeline
    $scope.arModules = null;
    $scope.getArModules = function() {
        if (!$scope.arModules) {
            Restangular.one('module/').getList().
            then(function(res){
                $scope.arModules = res;
                console.log(res);
            });
        }
    };

//    $scope.removeFromPipeline

    $scope.submitJob = function(){
        var arRunRoute = Restangular.one('user', kbaseSessionService.getUser()).one(
            'job', 'new');
        // Build message
        for (var i=0; i < $scope.stagedLibraries.length; i++) {
            var lib = $scope.stagedLibraries[i];
            arastService.addLib(lib);
        }
        arastService.setPipeline($scope.pipeline);
        console.log(arastService.getArRequest());
        arastService.submitRequest();

    };


    $scope.pipeline = [];
    $scope.arServerUrl = "140.221.84.203";


    var userroute = Restangular.one('user', kbaseSessionService.getUser());
    $scope.returnMsg = userroute.getList('files');

    $scope.getShockUrl = function(){
    	console.log("getShockUrl()");
    	var shockCall = Restangular.one('shock/').getList();
    	shockCall.then(function(data){
    		return data.shockurl;
    	});
    };

    $scope.switchFileList = function(showPublic){
        if (showPublic) {
            $scope.showPublicFiles = true;
        } else {
            $scope.showPublicFiles = false;
        }
        $scope.listUserFiles();
    }

    $scope.listUserFiles = function(){
    	var shockCall = Restangular.one('shock/').getList();
        $scope.userFiles = [];
        var headers = {};
        if ($scope.showPublicFiles){
            headers = {"Authorization": "OAuth " + $scope.arToken};
        }

    	shockCall.then(function(data){
    		return data.shockurl;
    	}).then(function(msg) {
    		var shockreq = "http://" + msg;
    		console.log(shockreq);
            var shockobj = Restangular.oneUrl('', shockreq);
    		shockobj.getList('node',{}, 
                //
                headers
                ).then(function(shockres, error){
                    for (var i=0; i < shockres.length;i++) {
                        //$scope.userFiles.push({'Filename': shockres[i].file.name});
                        $scope.userFiles.push(shockres[i]);
                    }
    			});
    	});

    };
  
  }]);

var isOnGitHub = false;
var arasturl = 'http://140.221.84.203:8000';
var uploadUrl = ''

angular.module('assemblyNgApp')
    .controller('ArFileUploadController', [
            '$scope', '$http', '$filter', '$window', 'arastService',
            function ($scope, $http, $filter, $window, arastService) {
                $scope.arToken = "un=cbun|tokenid=79e22acc-19bd-11e3-b4d5-1231391ccf32|expiry=1410314733|client_id=cbun|token_type=Bearer|SigningSubject=https://nexus.api.globusonline.org/goauth/keys/7aba18ba-19bd-11e3-b4d5-1231391ccf32|sig=0c77f654dd38869df4d8b32bec99d9e41a98f9e545f17f7b94cb05fdee88b3fd9e9d09cfafaa0020a59198445f54a5cb0aa21dca68d49f774b6b6a1c1a37a9a660abb48401b2934677480aec810dd03a6398a1b4d36d27e0b0b59a54b14a3b0bc662bfae2ebae8e043a35a2cb39b04dafd7a310c381c18d42f332031cf5ff11f";

                $scope.autoAssemble = false;
                $scope.uploadText = "";
                $scope.$watch('autoAssemble', function(){
                    $scope.uploadText = $scope.autoAssemble ? "Upload & Assemble" : "Upload";
                });
                $http.get(arasturl + '/shock/').then(function(data){
                    $scope.uploadUrl = 'http://' + data.data.shockurl + '/node/';
                });

                //    console.log($scope.shockUrl);

                $scope.options = {
                    url: uploadUrl,
//                    headers: {'Authorization': "OAuth " + $scope.arToken},

                    // done: function(e, data){
                    //     console.log(e);
                    //     console.log(data.result);
                    //     //$scope.queue = [];
                    // }
                };

                $scope.loadingFiles = true;
                $http.get($scope.uploadUrl)
                    .then(
                        function (response) {
                            //console.log(response);
                            $scope.loadingFiles = false;
                            $scope.queue = response.data.file || [];
                        },
                        function () {
                            $scope.loadingFiles = false;
                        }
                        );


                $scope.$on('fileuploaddone', function(e, data){ 
                    console.log('done');
                    var shockNode = data.result.data;
                    console.log(shockNode)
                    arastService.addSingle(shockNode);
                    console.log(arastService.getArRequest());
                    if ($scope.autoAssemble) {
                        arastService.submitRequest();
                        console.log("submitted");
                    }
                });



            }


        ])

        .controller('FileDestroyController', [
            '$scope', '$http',
            function ($scope, $http) {
                var file = $scope.file,
                    state;
                if (file.url) {
                    file.$state = function () {
                        return state;
                    };
                    file.$destroy = function () {
                        state = 'pending';
                        return $http({
                            url: file.deleteUrl,
                            method: file.deleteType
                        }).then(
                            function () {
                                state = 'resolved';
                                $scope.clear(file);
                            },
                            function () {
                                state = 'rejected';
                            }
                        );
                    };
                } else if (!file.$cancel && !file._index) {
                    file.$cancel = function () {
                        $scope.clear(file);
                    };
                } else {
                    console.log('do nothing');
                }
            }
        ]);


angular.module('assemblyNgApp')
    .controller('ArStatusCtrl', [
            '$scope', 'arastRestService',
            function ($scope, arastRestService) {
                $scope.userDocs = arastRestService.getStatusAll();

                //NG Grid for Shock files
                $scope.mySelections = []
                $scope.gridOptions = { 
                    data: "userDocs",
                    selectedItems: $scope.mySelections,
                    multiSelect: false,
                    columnDefs: [
                    {field: "job_id", displayName: 'Job', width: 100},
                    {field: "status", displayName: "Status"},
                    {field: "message", displayName: "Description"}
                    ]
    };
    }]);

angular.module('assemblyNgApp')
    .controller('DashboardCtrl', ['$scope', '$location', 'kbaseSessionService',
            function ($scope, $location, kbaseSessionService) {
                $scope.dashView = 'status';
                $scope.tooltipQuick = 'Instantly perform automated assembly upon file uploads';
                $scope.tooltipCustom = 'Select libraries and create an assembly pipeline manually';
                $scope.tooltipAnalyze = 'Perform analysis methods on assemblies';
                $scope.clickQuick = function(){
                    $location.path('/quick');
                };
                $scope.clickCustom = function(){
                    $location.path('/pipeline');
                };
                $scope.changeDashView = function(newView){
                    $scope.dashView = newView;
                };
    }]);

angular.module('assemblyNgApp')
    .controller('MainCtrl', ['$scope', '$location', '$route',
                             'kbaseSessionService', 'webStorage',
            function ($scope, $location, $route, kbaseSessionService, webStorage) {
                // Check if user is logged in
                $scope.loggedIn = kbaseSessionService.isLoggedIn();
                $scope.arUser = kbaseSessionService.getUser();
                if (!$scope.loggedIn) {
                    if (kbaseSessionService.checkSession()){ // Has previous session
                        console.log('has previous session. proceed')
                        $scope.loggedIn = kbaseSessionService.isLoggedIn();
                        $scope.arUser = kbaseSessionService.getUser();
                    }
                }

                var currentLocation = $location.path();
                $scope.$on("$routeChangeStart", 
                    function (event, nextRoute) {
                        $scope.loggedIn = kbaseSessionService.isLoggedIn();
                        $scope.arUser = kbaseSessionService.getUser();
                        var nextLocation = $location.path();
                        if (!nextRoute.access.isFree && !$scope.loggedIn) {
                                var loginRoute = "/login" + nextLocation;
                                console.log(loginRoute);
                                $location.path(loginRoute);
                        } else {
                            console.log("either logged, or access free");
                            console.log($scope.loggedIn);
                        }
                });

                $scope.logIn = function(){
                    $location.path('/login/');
                };

                $scope.logOut = function(){
                    kbaseSessionService.clearSession();
                    $route.reload();
                };

                $scope.gotoDash= function(){
                    $location.path('/dashboard/');
                };

}]);


angular.module('assemblyNgApp')
    .controller('LoginCtrl', ['$scope', '$location', '$route', '$routeParams', 'kbaseSessionService',
            function ($scope, $location, $route, $routeParams, kbaseSessionService) {
                $scope.redirect = $routeParams.redirect;
                $scope.loggedIn = false;
                $scope.$location = $location;
                console.log($scope.redirect);

                $scope.setLoggedIn = function(user, token) {
                    console.log('Redirecting!' + $scope.redirect);
                    kbaseSessionService.setLoggedIn(user, token);
                    $location.path("/" + $scope.redirect + "/");
                    $scope.$apply();



                };
    }]);