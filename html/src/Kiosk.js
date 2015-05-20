var app = angular.module('myApp', ['ngSanitize']);


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

app.controller('kodiCtrl', function($scope, $timeout, $http){
    $scope.episodes = [];
    
    (function tick() {
        $http.get('api/v1/kodi').
          success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.episodes = data;
            $timeout(tick, 1000*60*60*4);

          }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });

    })();

});