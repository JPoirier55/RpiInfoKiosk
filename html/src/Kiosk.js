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
          $timeout(tick, 1000*10);
    })();

});

app.controller('ExampleController', ['$scope', '$interval',
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
