'use strict';

angular.module('assemblyNgApp')
  .controller('UserFileCtrl', function ($scope, $resource, Restangular) {
    $scope.stagedFilesFlat = [];
    $scope.stagedLibraries = [];
    $scope.libCount = 0;
    $scope.shockUrl = "";
    $scope.userFiles = [];

    //Navigation
    $scope.arStage = 4;
    $scope.nextStage = function(){
        $scope.arStage++;
    };

    $scope.showUpload = false;
    $scope.toggleUpload = function(){
        $scope.showUpload = !$scope.showUpload;
    };

    $scope.stageFile = function(files){
    	//initial files
    	if ($scope.libCount == 0) {
    		$scope.addLibrary();
    	}
    	var lastLib = $scope.stagedLibraries.pop();
    	lastLib.files = lastLib.files.concat(files);
    	$scope.stagedLibraries.push(lastLib);
    };

    $scope.addLibrary = function(){
        $scope.libCount++;
    	var libname = "Library " + $scope.libCount;
    	var newLib = {name: libname,
    	              files: [],
                insert: null,
                stdev: null};
    	$scope.stagedLibraries.push(newLib);
    }

    //NG Grid for Shock files
    $scope.mySelections = []
    $scope.gridOptions = { data: "userFiles",
    selectedItems: $scope.mySelections,
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

    $scope.submitPipeline = function(){
        var arRunRoute = Restangular.one('user', $scope.arUser).one(
            'job', 'new');
        // Build message
        var data = {"pipeline": $scope.pipeline,
                "pair": [],
                "single": []};
        for (var i=0; i < $scope.stagedLibraries.length; i++) {
            var lib = $scope.stagedLibraries[i];
            if (lib.files.length == 2) {
                data.pair.push(lib.files);
            }
            else {
                data.single.push(lib.files);
            }
        }
    };


    $scope.pipeline = [];
    $scope.arServerUrl = "140.221.84.203";
    $scope.arUser = "cbun";
    $scope.arToken = "un=cbun|tokenid=79e22acc-19bd-11e3-b4d5-1231391ccf32|expiry=1410314733|client_id=cbun|token_type=Bearer|SigningSubject=https://nexus.api.globusonline.org/goauth/keys/7aba18ba-19bd-11e3-b4d5-1231391ccf32|sig=0c77f654dd38869df4d8b32bec99d9e41a98f9e545f17f7b94cb05fdee88b3fd9e9d09cfafaa0020a59198445f54a5cb0aa21dca68d49f774b6b6a1c1a37a9a660abb48401b2934677480aec810dd03a6398a1b4d36d27e0b0b59a54b14a3b0bc662bfae2ebae8e043a35a2cb39b04dafd7a310c381c18d42f332031cf5ff11f";


    var userroute = Restangular.one('user', $scope.arUser);
    $scope.returnMsg = userroute.getList('files');

    $scope.getShockUrl = function(){
    	console.log("getShockUrl()");
    	var shockCall = Restangular.one('shock/').getList();
    	shockCall.then(function(data){
    		return data.shockurl;
    	});
    };

    $scope.listUserFiles = function(){
    	// if ($scope.shockUrl == ""){
    	// 	$scope.getShockUrl();
    	// }

    	var shockCall = Restangular.one('shock/').getList();
    	shockCall.then(function(data){
    		return data.shockurl;
    	}).then(function(msg) {
    		var shockreq = "http://" + msg;
    		console.log(shockreq);
            var shockobj = Restangular.oneUrl('', shockreq);
    		shockobj.getList('node',{}, {
                "Authorization": "OAuth " + $scope.arToken
            }).then(function(shockres, error){
                    for (var i=0; i < shockres.length;i++) {
                        $scope.userFiles.push({'Filename': shockres[i].file.name});
                    }
    			});

    	});

    };
  
  });

var isOnGitHub = false;
var arasturl = 'http://140.221.84.203:8000';
var uploadUrl = ''

angular.module('assemblyNgApp')
    .controller('FileUploadController', [
            '$scope', '$http', '$filter', '$window',
            function ($scope, $http) {
                console.log('load controller')
                console.log($scope);
                $scope.arToken = "un=cbun|tokenid=79e22acc-19bd-11e3-b4d5-1231391ccf32|expiry=1410314733|client_id=cbun|token_type=Bearer|SigningSubject=https://nexus.api.globusonline.org/goauth/keys/7aba18ba-19bd-11e3-b4d5-1231391ccf32|sig=0c77f654dd38869df4d8b32bec99d9e41a98f9e545f17f7b94cb05fdee88b3fd9e9d09cfafaa0020a59198445f54a5cb0aa21dca68d49f774b6b6a1c1a37a9a660abb48401b2934677480aec810dd03a6398a1b4d36d27e0b0b59a54b14a3b0bc662bfae2ebae8e043a35a2cb39b04dafd7a310c381c18d42f332031cf5ff11f";

                $http.get(arasturl + '/shock/').then(function(data){
                    $scope.uploadUrl = 'http://' + data.data.shockurl + '/node/';
                });

                //    console.log($scope.shockUrl);

                $scope.options = {
                    url: uploadUrl,
                    headers: {'Authorization': "OAuth " + $scope.arToken},
                    done: function(data){
                        console.log(data);
                        console.log($scope);
                        //$scope.queue = [];
                    }

                };
                $scope.queue = [];
                // if (!isOnGitHub) {
                //     $scope.loadingFiles = true;
                //     $http.get($scope.uploadUrl)
                //         .then(
                //             function (response) {
                //                 //console.log(response);
                //                 $scope.loadingFiles = false;
                //                 $scope.queue = response.data.file || [];
                //             },
                //             function () {
                //                 $scope.loadingFiles = false;
                //             }
                //         );
                // }
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
