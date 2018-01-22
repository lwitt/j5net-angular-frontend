var app = angular.module('j5netControllers');

app.controller('nodeDetailCtrl', ['$scope', 'webSocket', '$routeParams', 'nodes', function($scope, webSocket, $routeParams,nodes) {
      $scope.nodeId = $routeParams.nodeId || 25;

      $scope.graphstate = 0;
      $scope.graphtitle = "title";
      $scope.graphtitleminmax = "";
      $scope.dt = null;

      $scope.nvd3_data = [
            {
                  values :    [],
                  key :       '°C',
                  color :     '#ff7f0e',
                  area :      true
            }
      ];

      $scope.nvd3_options = {
            chart: {
                  type: 'lineChart',
                  height: 400,
                  margin : {
                        top:        20,
                        right:      20,
                        bottom:     40,
                        left:       55
                  },
                  useInteractiveGuideline: false,
                  xAxis: {
                        ticks:      12,
                        showMaxMin: false,
                  },
                  xDomain :         [0,23],
                  yDomain :         [-20,50],
                  interpolate : 'basis',
                  yAxis: {
                        axisLabel: 'temp (°C)',
                        tickFormat: function(d){
                              return d3.format('.02f')(d);
                        },
                        axisLabelDistance: -10
                  },
                  callback: function(chart){
                  }
            }
      };

      $scope.today = function() {
            $scope.dt = new Date();
      };

      $scope.today();

      $scope.clear = function() {
            $scope.dt = null;
      };

      $scope.dateOptions = {
            formatYear: 'yy',
            //minDate: new Date(),
            startingDay: 1
      };

      $scope.open1 = function() {
            $scope.popup1.opened = true;
      };

      $scope.open2 = function() {
            $scope.popup2.opened = true;
      };

      // $scope.setDate = function(year, month, day) {
      //     $scope.dt = new Date(year, month, day);
      // };

      $scope.formats = ['dd-MMMM-yyyy', 'dd.MM.yyyy', 'shortDate'];
      $scope.format = $scope.formats[1];

      $scope.popup1 = {
            opened: false
      };

      $scope.popup2 = {
            opened: false
      };

      $scope.$on('socket:weather', function (ev, data) {
            console.log("weather received");
            console.log(data);
            $scope.graphtitleminmax = " min: xxx°C";
            $scope.nvd3_data[0].values.push({x:0,y:10});
            $scope.weather = data;
            $scope.graphstate = 2;
            
      });

      $scope.$on('socket:node-detail', function (ev, data) {
            console.log("receiving node details");

            if (data.tmin && data.tmax) {
                  $scope.graphtitleminmax = " min: "+data.tmin+"°C  max: "+data.tmax+"°C";
                  $scope.nvd3_options.chart.yDomain = [Math.floor(data.tmin-2),Math.ceil(data.tmax+2)];
            }

            $scope.nvd3_data[0].values = [];
            for (var i in data.data) {
                  if (data.data[i]) {
                        $scope.nvd3_data[0].values.push({x:i,y:data.data[i]});
                  }
            }

            $scope.graphtitle = nodes.get($routeParams.nodeId).name;

            $scope.graphstate = 2;

      });

      var askForDetail = function () {

            console.log("ask for detail");
            $scope.graphstate = 1;
            // console.log($scope.dt);
            var startDate = new Date($scope.dt);
            startDate.setHours (0,0,0,0);
            var endDate = new Date($scope.dt);
            endDate.setHours (23,59,59,0);

            $scope.nvd3_data[0].values = [];

            webSocket.emit(
                  'node-detail',
                  {   id: $scope.nodeId,
                        start : startDate,
                        end : endDate,
                  }
            );
      }

      $scope.$watch("dt", askForDetail);
}]);
