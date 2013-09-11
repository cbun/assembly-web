'use strict';

angular.module('assemblyNgApp')
  .controller('UserFileCtrl', function ($scope, $resource, Restangular) {
    $scope.stagedFilesFlat = [];
    $scope.stagedLibraries = [];
    $scope.libCount = 0;
    $scope.shockUrl = "";
    $scope.userFiles = [];

    $scope.stageFile = function(files){
    	//initial files
    	if ($scope.libCount == 0) {
    		$scope.libCount++;
    		$scope.addLibrary();
    	}
    	var lastLib = $scope.stagedLibraries.pop();
    	lastLib.files = lastLib.files.concat(files);
    	$scope.stagedLibraries.push(lastLib);
    };

    $scope.addLibrary = function(){
    	if ($scope.libCount == 0) {
    		$scope.libCount++;
    	}
    	var libname = "Library " + $scope.libCount;
    	var newLib = {name: libname,
    	              files: []};
    	$scope.libCount++;
    	$scope.stagedLibraries.push(newLib);
    }

    //NG Grid
    $scope.mySelections = []
    $scope.gridOptions = { data: "userFiles",
    selectedItems: $scope.mySelections,
	};

    //Test
    $scope.arModules = [
      {name: "kiki",
       version: "1.0"},
       {name: "velvet",
       version: "1.0"}
    ];
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
