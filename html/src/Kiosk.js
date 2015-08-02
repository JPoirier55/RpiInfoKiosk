var app = angular.module('myApp', ['ngSanitize']);


app.controller('dataCtrl', function($scope, $timeout, $http){
    $scope.data = [];
    

    var radarImages = [];
    (function tick() {
        $http.get('api/v1/weather').
          success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.data = data;
            radarImages = data.radar_imgs;
            //30 Mins
            $timeout(tick, 1000*60*30);

          }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });

    })();


    var radarImageIndex = 0;
    (function tick() {
          $scope.radar_image = radarImages[radarImageIndex];
          radarImageIndex = (radarImageIndex === 0) ? 1 : 0;
          //30 Mins
          $timeout(tick, 1000*15);
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
            
            //5mins
            $timeout(tick, 1000*60*5);

          }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });

    })();

});

app.controller('kodiCtrl', function($scope, $timeout, $http, $sce){
    $scope.episodes = [];
    
    (function tick() {
        $http.get('api/v1/kodi').
          success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.iframe_url = $sce.trustAsResourceUrl(data[data.length-1].map_src);
            $scope.episodes = data;
            $timeout(tick, 1000*60*60*3);

          }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });

    })();

});
