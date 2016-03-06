app.controller('traktCtrl', function($scope, $timeout, $http, $sce){
    $scope.update = function(pin) {
      console.log(pin);
      $http.get('api/v1/trakt?pin='+pin).
        success(function(data, status, headers, config) {
          $scope.url = data;
        }).
        error(function(data, status, headers, config) {
          console.log("Error getting results");
      });
    };

    $http.get('api/v1/trakt?setup=true').
      success(function(data, status, headers, config) {
        console.log(data);
        $scope.setup_url = data.setup_url;
      }).
      error(function(data, status, headers, config) {
        console.log("Error getting results");
    });
});

