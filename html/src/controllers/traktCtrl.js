app.controller('traktCtrl', function($scope, $timeout, $http, $sce){
    $scope.update = function(pin) {
      console.log(pin);
      $http.get('api/v1/trakt?pin='+pin).
        success(function(data, status, headers, config) {
          console.log(data);
          if(data.status){
            $scope.status = "Status: " + data.status;            
          }else {
            alert("Something went wrong.");
          }
          
        }).
        error(function(data, status, headers, config) {
          console.log("Error getting results");
      });
    };

    $http.get('api/v1/trakt?setup=true').
      success(function(data, status, headers, config) {
        $scope.setup_url = data.setup_url;
      }).
      error(function(data, status, headers, config) {
        console.log("Error getting results");
    });
});

