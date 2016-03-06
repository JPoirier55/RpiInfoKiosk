app.controller('mtaCtrl', function($scope, $timeout, $http, $compile){
    $scope.mtaData = [];
    (function tick() {
        $http.get('api/v1/mta').
          success(function(data, status, headers, config) {
            if(typeof variable !== 'undefined' || data.length === 0){
              return;
            }

            $scope.mtaData = data;

            if(data[0].delays === true){
              angular.element('kiosk-wrapper').css('background', '#F44336');
            }else{
              angular.element('kiosk-wrapper').css('background', '');
            }

            //5mins
            $timeout(tick, 1000*60*5);


          }).
          error(function(data, status, headers, config) {});
    })();
});