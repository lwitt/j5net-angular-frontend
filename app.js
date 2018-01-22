// var app = angular.module('j5net', ['ngRoute', 'LocalStorageModule', 'j5netControllers','ui.bootstrap','btford.socket-io', 'ngMap','webcam']);
var app = angular.module('j5net', ['ngRoute', 'LocalStorageModule', 'j5netControllers','ui.bootstrap','btford.socket-io', 'ngMap']);

app.config(function($routeProvider,$locationProvider) {
      $locationProvider.hashPrefix('');
      $routeProvider.
      when('/dashboard', {
            templateUrl: 'partials/dashboard.html',
            controller: 'dashboardCtrl'
      }).
      when('/control', {
            templateUrl: 'partials/control.html',
            controller: 'controlCtrl'
      }).
      when('/list', {
            templateUrl: 'partials/list.html',
            controller: 'listCtrl'
      }).
      when('/setup', {
            templateUrl: 'partials/setup.html',
            controller: 'setupCtrl'
      }).
      when('/debug', {
            templateUrl: 'partials/debug.html',
            controller: 'debugCtrl'
      }).
      when('/car', {
            templateUrl: 'partials/car.html',
            controller: 'carCtrl'
      }).
      when('/pollen', {
            templateUrl: 'partials/pollen.html',
            controller: 'pollenCtrl'
      }).
      when('/detail/:nodeId', {
            templateUrl: 'partials/detail.html',
            controller: 'nodeDetailCtrl'
      }).
      otherwise({
            redirectTo: '/dashboard'
      });
});

app.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('j5net');
});

app.factory('webSocket', function (socketFactory) {
      var mySocket = socketFactory();
      mySocket.forward('connect');
      mySocket.forward('connect_error');
      mySocket.forward('nodes');
      mySocket.forward('node-detail');
      mySocket.forward('car-position');
      mySocket.forward('weather');
      return mySocket;
});

app.factory('applog', function() {
      var applog = {};
      applog.messages = [];

      applog.add = function (message,severity) {
            if (applog.messages.length>25)
                  applog.messages.shift();
            applog.messages.push({date: new Date(),message : message, severity : severity});
      }

      return applog;
});

app.factory('nodes', function () {
      var nodes = {};
      nodes.list = {};
      nodes.count = 0;

      nodes.set = function(newvals) {
            nodes.list = newvals;
            nodes.count = Object.keys(nodes.list).length;
      }

      nodes.get = function(i) {
            if (i) {
                  return nodes.list[i];
            }
            else {
                  return nodes.list;
            }
      }

      return nodes;
});

app.factory('j5netConfig', function (localStorageService) {
      var config = {};
      config.screensaver_delay = 45;

      if (localStorageService.get("screensaver_delay")==null)
            localStorageService.set("screensaver_delay",45);

      config.setScreenSaverDelay = function (delay) {
            config.screensaver_delay = delay;
            return localStorageService.set("screensaver_delay",delay)
      };

      config.getScreenSaverDelay = function () {
            config.screensaver_delay = localStorageService.get("screensaver_delay")
            return config.screensaver_delay;
      };
      return config;
});

app.factory('screensaver', function ($timeout,j5netConfig,applog) {
      var screensaver = {};
      screensaver.timerPromise = null;
      screensaver.active = {value :false};

      screensaver.start = function() {
            if (j5netConfig.getScreenSaverDelay()!=0) {
                  screensaver.cancel();
                  screensaver.timerPromise = $timeout(function() {
                        screensaver.active.value = true;
                        applog.add("going to sleep!","info");
                  },
                  j5netConfig.getScreenSaverDelay()*1000);
            }
      };

      screensaver.cancel = function() {
            $timeout.cancel(screensaver.timerPromise);
      }

      screensaver.reset = function() {
            screensaver.cancel();
            screensaver.start();
      }

      screensaver.start();

      return screensaver;
});

// app.directive('myRoundProgress', function() {
//     return {
//         templateUrl : 'partials/my-round-progress.html',
//         scope: {
//             value: "@value"
//         }
//     };
// });

app.filter('secondsToDateTime', [function() {
      return function(seconds) {
            return new Date(1970, 0, 1).setSeconds(seconds);
      };
}]);

app.filter('secondsToString', [function() {
      return function(totalSec) {
            var hours = parseInt( totalSec / 3600);
            var minutes = parseInt( (totalSec - hours * 3600) / 60 );
            var seconds = parseInt( totalSec - hours * 3600 - minutes * 60);
            if (hours===0)
            return (minutes < 10 ? "0" + minutes : minutes)+'m '+(seconds  < 10 ? "0" + seconds : seconds)+'s';
            else
            return (hours < 10 ? "0" + hours : hours)+'h '+(minutes < 10 ? "0" + minutes : minutes)+'m '+(seconds  < 10 ? "0" + seconds : seconds)+'s';
      };
}]);
