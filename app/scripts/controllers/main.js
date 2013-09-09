'use strict';

angular.module('assemblyNgApp')
  .controller('UserFileCtrl', function ($scope, Restangular) {
    $scope.stagedFilesFlat = [];
    $scope.stagedLibraries = [];
    $scope.libCount = 0;

    $scope.stageFile = function(files){
    	//initial files
    	if ($scope.libCount == 0) {
    		$scope.libCount++;
    		$scope.addLibrary();
    	}
    	var lastLib = $scope.stagedLibraries.pop();
    	lastLib.files = lastLib.files.concat(files);
    	$scope.stagedLibraries.push(lastLib);
    	console.log(lastLib);

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
    $scope.userFiles = [
      {"filename": "1.fq"},
      {"filename": "2.fq"}
    ];
    $scope.arModules = [
      {name: "kiki",
       version: "1.0"},
       {name: "velvet",
       version: "1.0"}
    ];
    $scope.arServerUrl = "140.221.84.203";
    $scope.arUser = "cbun";

    var userroute = Restangular.one('cbun');
    $scope.returnMsg = userroute.getList("files");

  });
