'use strict';

angular.module('assemblyNgApp')
  .controller('UserFileCtrl', ['$scope', '$resource', 'Restangular', 'arastService', 'kbaseSessionService', 'arastRestService',
    function ($scope, $resource, Restangular, arastService, kbaseSessionService, arastRestService) {

    $scope.arUser = kbaseSessionService.getUser();
    $scope.arToken = kbaseSessionService.getToken();
    $scope.stagedFilesFlat = [];
    $scope.stagedLibraries = arastService.data.stagedLibraries;
    $scope.libCount = $scope.stagedLibraries.length;
    $scope.shockUrl = "";
    $scope.showPublicFiles = true;
    $scope.userFiles = [];


    // Shock node staging
    $scope.shockInput = false;
    $scope.shocknode = 'hello';

    $scope.stageNode = function(node) {
        console.log(node)
        var sObjs = [{'id': node, 'handle_type': 'shocknode', "file": {"name": "sn-" + node}}]
        $scope.stageFile(sObjs);
        $scope.clearNode();
    };

    $scope.clearNode = function() {
        $scope.shocknode = '';
        $scope.shockInput = false;
    };

    $scope.enableShock = function() {
        $scope.shockInput = true;
        $scope.shocknode = '';
    };


    //Navigation
    $scope.arStage = 1;
    $scope.nextStage = function(){
        $scope.arStage++;
    };

    $scope.prevStage = function(){
        $scope.arStage--;
    };

    $scope.stageFile = function(shockObjs){
    	//initial files
    	if ($scope.stagedLibraries.length == 0) {
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

    $scope.rmLibrary = function(libname) {
        var idx = $scope.stagedLibraries.indexOf(libname);
        $scope.stagedLibraries.splice(idx, 1);

    };



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
        arastService.data.stagedLibraries = [];

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

    $scope.listUserFiles = function(filetype){
        arastRestService.getFiles(filetype).then(function(shockres){
            console.log(shockres);
            for (var i=0; i < shockres.length;i++) {
                $scope.userFiles.push(shockres[i]);
            }
        });
    };
  
  }]);

var isOnGitHub = false;
var arasturl = 'http://140.221.84.203:8000';
var uploadUrl = ''

angular.module('assemblyNgApp')
    .controller('ArFileUploadController', [
            '$scope', '$http', '$filter', '$window', 'arastService', 'arastRestService', 'shockService',
            function ($scope, $http, $filter, $window, arastService, arastRestService, shockService) {
                //Init: Recipes
                arastRestService.getRecipes().then(function(data){
                    $scope.arRecipes = data;
                    $scope.activeRecipe = $scope.arRecipes[0];
                });
                //Init: Shock Upload
                arastRestService.getShockUrl().then(function(shockurl) {
                    $scope.uploadUrl = "http://" + shockurl + "/node";
                });
                $scope.queue = [];

                $scope.autoAssemble = false;
                $scope.uploadText = "";
                $scope.$watch('autoAssemble', function(){
                    $scope.uploadText = $scope.autoAssemble ? "Upload & Assemble" : "Upload";
                });

                $scope.$on('fileuploaddone', function(e, data){ 
                    var shockNode = data.result.data;
                    var attr = {'filetype': 'reads'}
                    arastService.addSingle(shockNode);
                    shockService.updateNode(shockNode.id, attr);

                });
                $scope.$on('fileuploadstop', function(e, data){ 
                    $scope.queue = [];
                    if ($scope.autoAssemble) {
                        arastService.setPipeline($scope.activeRecipe.pipeline, true);
                        arastService.submitRequest();
                        console.log("Job Submitted")
                    }
                });

                $scope.setRecipe = function(recipe) {
                    $scope.activeRecipe = recipe;
                }
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


var statusCtrl = angular.module('assemblyNgApp')
    .controller('ArStatusCtrl', [
            '$scope', '$q', 'arastRestService',
            function ($scope, $q, arastRestService) {
                $scope.loaded = false;
                $scope.userDocs;
                $scope.mySelections = [];
                // $scope.$watch('mySelections[0]', function(){
                //     console.log($scope.mySelections)
                // });

                $scope.enableDlLink = function(job_data){
                    //$scope.downloadLink = 'http://' www.
                    console.log(job_data);
                    var job_id = job_data.job_id;
                    var asm_re = /assemblies/;
                    var ctg_re = /ctg/;
                    arastRestService.getShockNodes(job_id).then(function(nodes){
                        for (var key in nodes){
                            if (asm_re.exec(key)){
                                var id = nodes[key];
                                $scope.asmDownloadLink = "http://" + $scope.shockUrl + '/node/' +
                                  id + "/?download";
                                console.log($scope.asmDownloadLink);    
                            }
                            if (ctg_re.exec(key)){
                                var id = nodes[key];
                                $scope.ctgDownloadLink = "http://" + $scope.shockUrl + '/node/' +
                                  id + "/?download";
                                console.log($scope.ctgDownloadLink);    
                            }
                        }
                    })
                };
                $scope.gridOptions = { 
                    data: "userDocs",
                    selectedItems: $scope.mySelections,
                    multiSelect: false,
                    columnDefs: [
                    {field: "job_id", displayName: 'Job', width: 100},
                    {field: "status", displayName: "Status"},
                    {field: "message", displayName: "Description"}
                    ],
                    rowTemplate:'<div style="height: 100%" ng-class="{arGridSuccess: row.getProperty(\'status\').substring(0,4) == \'pipe\', arGridFail: row.getProperty(\'status\').substring(0,4) != \'pipe\', arGridRun: row.getProperty(\'status\').substring(0,4) == \'Runn\'}"><div  \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell ">' +
                    '<div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }"> </div>' +
                   '<div ng-cell></div>' +
                   '</div></div>'
                };

                $scope.refreshStatus = function(){
                    console.log('Refreshing status');
                    arastRestService.getStatusAll(true).then(function(data){
                        $scope.userDocs = data;
                    });
                };

                $scope.killJob = function(job_id){
                    arastRestService.killJob(job_id).then(function(res){
                        alert(res);
                    })
                };

                arastRestService.getStatusAll().then(function(data){
                    $scope.userDocs = data;
                    $scope.loaded = true;
                    return data;
                });

                arastRestService.getShockUrl().then(function(data){
                    $scope.shockUrl = data;
                });


                
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

angular.module('assemblyNgApp')
    .controller('JobInfoCtrl', ['$scope', '$location', '$route', '$routeParams', 'arastRestService',
            function ($scope, $location, $route, $routeParams, arastRestService) {
                $scope.job_id = $routeParams.id;
                $scope.$location = $location;
                $scope.jobInfo;
                console.log($scope.job_id);
                arastRestService.getJobInfo($scope.job_id).then(function(res){
                    $scope.jobInfo = res;
                });

    }]);