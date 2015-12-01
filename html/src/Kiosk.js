var app = angular.module('myApp', ['ngSanitize','angular-skycons']);

var nightMode = document.createElement('link');
nightMode.rel = "stylesheet";
nightMode.type = "text/css";
nightMode.href = "./src/views/night_mode.css";
              
app.controller('weatherCtrl', function($scope, $timeout, $http){
    $scope.data = [];
    $scope.nightMode = "";
    
    $scope.CurrentWeather = {
        forecast: {
            icon: "snow",            
        }
    };
    
    var radarImages = [];
    (function tick() {
        $http.get('api/v1/weather').
          success(function(data, status, headers, config) {
            $scope.data = data;            
            radarImages = data.currently.imgs;
            //15 Mins
            $timeout(tick, 1000*60*15);


            //This enables night mode!
            var today = new Date();
            
            var minsRegex = /:(\d+)\s/;           
            var sunset = new Date();
            sunset.setHours(parseInt(data.currently.sunsetTime.charAt(0)) + 12);                        
            sunset.setMinutes(data.currently.sunsetTime.match(minsRegex)[1]);            
            
            if(sunset < today || today.getHours() < 7) {            
              var head = angular.element(document.querySelector('head'));
              head.append(nightMode);  
            } else {
              var head = angular.element(document.querySelector('head'));              
              $('link[rel=stylesheet][href~="./src/views/night_mode.css"]').remove();
            }

            
            
          }).
          error(function(data, status, headers, config) {            
          });

    })();

            
    var radarImageIndex = 0;
    (function tick() {
          $scope.radar_image = radarImages[radarImageIndex];
          radarImageIndex = (radarImageIndex === 0) ? 1 : 0;
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

app.controller('mtaCtrl', function($scope, $timeout, $http, $compile){
    $scope.mtaData = [];
    (function tick() {
        $http.get('api/v1/mta').
          success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.mtaData = data;
          
            if(data[0].delays){
              angular.element('body').css('background', '#F44336');
            }else{
              angular.element('body').css('background', '');  
            }
            
            
            //5mins
            $timeout(tick, 1000*60*5);

          }).
          error(function(data, status, headers, config) {});

    })();

});

app.controller('cardsCtrl', function($scope, $timeout, $http, $sce){
    $scope.cards = [];
    
    (function tick() {
        $http.get('api/v1/cards').
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
