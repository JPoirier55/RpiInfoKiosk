var app = angular.module('myApp', ['ngSanitize']);


app.controller('weatherCtrl', function($scope, $timeout, $http){
    $scope.data = [];
    $scope.nightMode = "";
    
    var radarImages = [];
    (function tick() {
        $http.get('api/v1/weather').
          success(function(data, status, headers, config) {
            $scope.data = data;
            radarImages = data.radar_imgs;
            //15 Mins
            $timeout(tick, 1000*60*15);


            //This enables night mode!
            var stylesheet = '<link href="./src/views/night_mode.css" rel="stylesheet">';
            var todayHour = new Date().getHours();
            var sunsetHour = parseInt(data.astronomy.sunset.charAt(0)) + 12;            
            
            if(sunsetHour - todayHour <= 0 || todayHour < 7) {
              $scope.nightMode = "./src/views/night_mode.css";
            } else {
              $scope.nightMode = "";              
            }
            
            
          }).
          error(function(data, status, headers, config) {            
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

app.controller('ClockController', ['$scope', '$interval',
    function($scope, $interval) {
        $scope.format = 'MMM dd, yyyy h:mm:ss a';
    }])
    // Register the 'myCurrentTime' directive factory method.
    // We inject $interval and dateFilter service since the factory method is DI.
    .directive('myCurrentTime', ['$interval', 'dateFilter',
      function($interval, dateFilter) {
        // return the directive link function. (compile function not needed)
        return function(scope, element, attrs) {
          var format,  // date format
              stopTime; // so that we can cancel the time updates

          // used to update the UI
          function updateTime() {
            element.text(dateFilter(new Date(), format));
          }

          // watch the expression, and update the UI on change.
          scope.$watch(attrs.myCurrentTime, function(value) {
            format = value;
            updateTime();
          });

          stopTime = $interval(updateTime, 1000);

          // listen on DOM destroy (removal) event, and cancel the next UI update
          // to prevent updating time after the DOM element was removed.
          element.on('$destroy', function() {
            $interval.cancel(stopTime);
          });
        };
}]);

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

app.controller('cardsCtrl', function($scope, $timeout, $http, $sce){
    $scope.cards = [];
    
    (function tick() {
        $http.get('api/v1/kodi').
          success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.iframe_url = $sce.trustAsResourceUrl(data[data.length-1].map_src);
            
            $scope.cards = data;
            $timeout(tick, 1000*60*60*1);

          }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });

    })();

});
