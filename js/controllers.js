var app = angular.module('j5netControllers', ['ngResource','nvd3','ui.bootstrap','angular-svg-round-progressbar']);


app.controller('mainController', ['$scope', '$timeout', 'webSocket', 'nodes', 'screensaver', 'applog', function($scope, $timeout, webSocket, nodes, screensaver, applog) {
      $scope.connected = false;
      $scope.nodes = nodes.get();
      $scope.screensaver = screensaver.active;

      $scope.weather = {};

      var everywhere = angular.element(window.document);

      everywhere.bind('click', function(event){
            if (screensaver.active.value == true) {
                  screensaver.active.value = false;
                  applog.add("waking up!","success");
                  $scope.$apply();
                  screensaver.start();
            }
            // else {
            //       screensaver.reset();
            // }
      });

      var timer = null, timer2 = null;

      $scope.$on('socket:nodes', function (ev, data) {
            // console.log("receiving nodes");
            for (var i in data) {
                  data[i].lastUpdate = (new Date()-new Date(data[i].lastUpdate))/1000;
                  data[i].firstSeen = (new Date()-new Date(data[i].firstSeen))/1000;
            }

            if (data["gw0/20"] && data["gw0/21"]) {
                  data["gw0/2021"] = {
                        lastData : {
                              t: Math.min(data["gw0/20"].lastData.t,data["gw0/21"].lastData.t)
                        },
                        lastUpdate : Math.min(data["gw0/20"].lastUpdate,data["gw0/21"].lastUpdate),
                        firstSeen : 0,
                        name : "extérieur"
                  };
            }
            else {
                  data["gw0/2021"] = {
                        lastData : {
                              t: 0
                        },
                        lastUpdate : 999999,
                        firstSeen : 0,
                        name : "extérieur"
                  }
            }

            nodes.set(data);
            $scope.nodes = nodes.get();
            applog.add("nodes received","info");
            //console.log(nodes.list);
            //console.log(nodes.count + " nodes");
      });


      $scope.$on('socket:connect', function (ev, data) {
            console.log('connected!');
            $scope.connected = true;

            applog.add("connected to backend","success");

            // getting the initial node list
            webSocket.emit('nodes');
            webSocket.emit('weather');
      });

      $scope.$on('socket:connect_error', function (ev, data){
            console.log('connect_error');
            $scope.connected = false;
            clearInterval(timer);
            clearInterval(timer2);
            timer = null; time2 = null;
            applog.add("connection to backend error","danger");
      });

      $scope.$on('socket:weather', function (ev, data) {
            // console.log("weather received");
            // console.log(data);
            $scope.weather = data;
            applog.add("weather received","info");
      });


      setInterval(function() {
            if (timer==null && $scope.connected==true) {
                  // console.log("initializing timer");
                  timer = setInterval(function() {
                        webSocket.emit('nodes');
                        webSocket.emit('car-position');
                        // console.log("asked for nodes");
                  },20000);
            }

            if (timer2==null && $scope.connected==true) {
                  // console.log("initializing timer2");
                  timer2 = setInterval(function() {
                        webSocket.emit('weather');
                  },10*60000);
            }
      },5000);

      // var askForDetail = function () {
      //
      //     console.log("ask for detail");
      //     $scope.graphstate = 1;
      //
      //     var startDate = new Date();
      //     startDate.setHours (0,0,0,0);
      //     var endDate = new Date();
      //     endDate.setHours (23,59,59,0);
      //
      //     $scope.nvd3_data[0].values = [];
      //
      //     webSocket.emit(
      //         'node-detail',
      //         {   id: 25,
      //             start : startDate.toISOString(),
      //             end : endDate.toISOString(),
      //         }
      //     );
      // }
      //
      // askForDetail();

}]);


app.controller('controlCtrl', ['$scope','webSocket',function($scope,webSocket) {

        $scope.fireAction = function (nodeid,type,action) {
            console.log("action fired " + nodeid + " : " + action);
            webSocket.emit('action',JSON.stringify({nodeid: nodeid,type : type, action: action}));
        }

      $scope.buttonList =
      [
            [
                  {
                        title :     'favoris',
                        style :     'info',
                        content:    [
                              {     label :           "tous les velux",
                                    type :            "updown"
                              },
                              {     label :           "tous les volets",
                                    type :            "updown"
                              }
                        ]
                  },
                  {     title :     'salon',
                        style :     'warning',
                        content:    [
                              {     label :           "tout le salon",
                                    type :            "onoff",
                                    action_type :     "rc_emit",
                                    action_on :       "757050000+757050001+757050002+1585815440",
                                    action_off :      "757049984+757049985+757049986+1585815424",
                                    action_nodeid :   100
                              },
                              {     label :           "luminaire",
                                    type :            "onoff",
                                    action_type :     "rc_emit",
                                    action_on :       757050000,
                                    action_off :      757049984,
                                    action_nodeid :   100
                              },
                              {     label :           "lumière TV",
                                    type :            "onoff",
                                    action_type :     "rc_emit",
                                    action_on :       757050001,
                                    action_off :      757049985,
                                    action_nodeid :   100
                              },
                              {     label :           "girlande escalier",
                                    type :            "onoff",
                                    action_type :     "rc_emit",
                                    action_on :       757050002,
                                    action_off :      757049986,
                                    action_nodeid :   100
                              },
                              {     label :           "girlande sapin",
                                    type :            "onoff",
                                    action_type :     "rc_emit",
                                    action_on :       1585815440,
                                    action_off :      1585815424,
                                    action_nodeid :   100
                              }
                        ]
                  }
            ],
            [
                  {     title :     'cuisine',
                        style :     'warning',
                        content:    [
                              {     label :     "spots",
                                    type :      "onoff"
                              },
                              {     label :     "applique",
                                    type :      "onoff"
                              },
                              {     label :     "spots table",
                                    type :      "onoff"
                              }
                        ]
                  },
                  {     title :     'extérieur',
                        style :     'warning',
                        content:    [
                              {     label :     "luminaire",
                                    type :      "onoff",
                                    action_type :     "relay/1",
                                    action_on :       "on",
                                    action_off :      "off",
                                    action_nodeid :   100
                              },
                              {     label :     "applique",
                                    type :      "onoff",
                                    action_type :     "relay/2",
                                    action_on :       "on",
                                    action_off :      "off",
                                    action_nodeid :   100
                              }
                        ]
                  }
            ]
      ]
}]);

app.controller('dashboardCtrl', ['$scope',function($scope) {
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
}]);

app.controller('listCtrl', ['$scope','$rootScope','nodes',function($scope,$rootScope,nodes) {
      $scope.nodes = nodes.list;
}]);

app.controller('pollenCtrl', ['$scope',function($scope) {

}]);

app.controller('debugCtrl', ['$scope','$window','localStorageService', 'applog',function($scope,$window,localStorageService,applog) {
      $scope.localStorageIsSupported=localStorageService.isSupported;
      $scope.applog = applog;

      $scope.reloadPage = function() {
            applog.add("asked for application reload","warning");
            $window.location.href="/";
      };
}]);

app.controller('setupCtrl', ['$scope','$timeout','j5netConfig','screensaver',function($scope,$timeout,j5netConfig,screensaver) {
      $scope.form_screensaver_delay = j5netConfig.getScreenSaverDelay();
      $scope.saved=false;

      $scope.update = function() {
            j5netConfig.setScreenSaverDelay($scope.form_screensaver_delay);
            screensaver.cancel();
            screensaver.start();
            $scope.saved=true;
      };

      $scope.closeAlert = function() {
            $scope.saved=false;
      };
}]);
