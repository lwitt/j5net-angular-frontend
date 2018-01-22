var app = angular.module('j5netControllers');

app.controller('carCtrl', ['$scope', 'webSocket', '$http','NgMap', '$timeout', function($scope, webSocket, $http, NgMap, $timeout) {

      $scope.config = {};
      $scope.lat=NaN;
      $scope.lng=NaN;
      $scope.lastCarUpdate=NaN;
      $scope.distanceFromWork=NaN;
      $scope.distanceFromHome=NaN;
      // $scope.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyC5-mTXh_p0umfRxLsp9oa63tK62xRRVyg";
      $scope.googleMapsUrl = "https://maps.google.com/maps/api/js?key=AIzaSyC5-mTXh_p0umfRxLsp9oa63tK62xRRVyg";
      $scope.map = null;

      NgMap.getMap().then(function(map) {
            console.log(map);
            $scope.map = map;
      });

      // NgMap.getMap().then(function(map) {
      //       $scope.map = map;
      // });

      // loading config (nodes to show in dashboard,..)
      // $http({method: 'GET', url: 'config.json'}).then(
      //       function successCallback(response) {
      //             $scope.config = response.data;
      //             $scope.googleMapsUrl ="https://maps.googleapis.com/maps/api/js?key="+$scope.config.googleMapsAPIkey;
      //             // $scope.pauseLoading=false;
      //       },
      //       function errorCallback(response) {
      //             console.log("error while loading local config !");
      //       }
      // );
      $scope.pauseLoading=true;


      console.log("toto");

      // $timeout(function() {
      //       console.log("Showing the map. The google maps api should load now.");
      //       // NgMap.getMap({id:'my_map'}).then(function(response) {
      // 	// 	google.maps.event.trigger(response, 'resize');
      // 	// });
      //       $scope.pauseLoading=false;
      //       var center = $scope.map.getCenter();
      //       google.maps.event.trigger($scope.map, "resize");
      //       $scope.map.setCenter(center);
      // }, 4000);

      // $scope.$on('socket:car-position', function (ev, data) {
      //       console.log("receiving car position");
      //       console.log(data);
      //       if (data.lat)                 $scope.lat = data.lat;
      //       if (data.lng)                 $scope.lng = data.lng;
      //       if (data.lastUpdate)          $scope.lastCarUpdate = (Date.now()-data.lastUpdate)/1000;
      //       if (data.distanceFromWork)    $scope.distanceFromWork = data.distanceFromWork;
      //       if (data.distanceFromHome)    $scope.distanceFromHome = data.distanceFromHome;
      // });
      //
      // if ($scope.connected==true)
      //       webSocket.emit('car-position');
}]);
