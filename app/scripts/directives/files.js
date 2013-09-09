
app.directive("arLib", function() {
  return {
    restrict: "E",
    scope: {
    	libdata: "="
    },
    templateUrl: "templates/seqLibraryWidget.html",
  }
})