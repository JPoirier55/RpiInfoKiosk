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
            sunset.setHours(parseInt(data.currently.sunsetTime.charAt(1)) + 12);
            sunset.setMinutes(data.currently.sunsetTime.match(minsRegex)[1]);


            if(sunset < today || today.getHours() < 7) {
              var head = angular.element(document.querySelector('head'));
              head.append(nightMode);
            } else {
              var head = angular.element(document.querySelector('head'));
              $('link[rel=stylesheet][href~="./src/views/night_mode.css"]').remove();
            }
          }).
          error(function(data, status, headers, config) {});

    })();

    var radarImageIndex = 0;
    (function tick() {
          $scope.radar_image = radarImages[radarImageIndex];
          radarImageIndex = (radarImageIndex === 0) ? 1 : 0;
          $timeout(tick, 1000*15);
    })();
});
