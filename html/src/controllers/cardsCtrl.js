
app.controller('cardsCtrl', function($scope, $timeout, $http, $sce){
    $scope.cards = [];

    (function tick() {
        $http.get('api/v1/cards').
          success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.iframe_url = $sce.trustAsResourceUrl(data[data.length-1].map_src);

            $scope.sections = data;
            $scope.pages = data.length;
            $timeout(tick, 1000*60*60*1);

          }).
          error(function(data, status, headers, config) {});

    })();


    //Page switching.
    $scope.currentPage = 0;
    (function tick() {
          if($scope.currentPage == $scope.pages-1){
            $scope.currentPage = 0;
          }else {
            $scope.currentPage = $scope.currentPage + 1;
          }
          $timeout(tick, 1000*10);
    })();

});