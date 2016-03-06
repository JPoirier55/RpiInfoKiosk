app.controller('logCtrl', function($scope, $timeout, $http, $sce){
    $scope.cards = [];

    $http.get('api/v1/log').
      success(function(data, status, headers, config) {
        $scope.logs = data;
      }).
      error(function(data, status, headers, config) {
        console.log("Error getting results");
    });
});
