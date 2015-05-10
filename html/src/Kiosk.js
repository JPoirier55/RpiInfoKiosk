var app = angular.module('myApp', []);


app.controller('dataCtrl', function($scope, $timeout, $http){
    $scope.data = [];


    (function tick() {
        $http.get('api/v1/weather').
          success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.data = data;
            $timeout(tick, 1000*60);

          }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });

    })();

});

app.controller('mtaCtrl', function($scope, $timeout, $http){
    $scope.mtaData = [];

    (function tick() {
        $http.get('api/v1/mta').
          success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.mtaData = data;
            $timeout(tick, 1000*60);

          }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });

    })();

});