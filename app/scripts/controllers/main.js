'use strict';

/**
 * @ngdoc function
 * @name aeropuertoElDoradoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the aeropuertoElDoradoApp
 */
angular.module('aeropuertoElDoradoApp')
  .controller('Controller', function ($scope, $http, baseURL, lodash) {

    var body = document.querySelector('body');
    var ads = document.querySelector('.ads');
    var table = document.querySelector('.table-responsive');

    $scope.change = function(type) {
      window.requestAnimationFrame(function() {
        $scope.flights = [];
        var requestURL= baseURL + '/themes/hostmev2-child/js/flight_status.json';
        var strings = [];
        strings.L = 'Llegadas';
        strings.S = 'Salidas';
        strings.N = 'Nacionales';
        strings.I = 'Internacionales';

        $scope.type = type;

        $http.get(requestURL).success(function(data) {
          if ($scope.type === 'LI' || $scope.type === 'LN') {
            $scope.flightsCache = data.arrivals;
          } else {
            $scope.flightsCache = data.departures;
          }
          if (type === 'LI' || type === 'SI') {
            $scope.flights = lodash.filter($scope.flightsCache, function(object) {
              return (object.flight_type === 'I')? true : false;
            });
          } else {
            $scope.flights = lodash.filter($scope.flightsCache, function(object) {
              return (object.flight_type === 'I' || object.flight_type === 'A')? true : false;
            });
          }
        }).error(function(){
          console.error('Something wrong happened');
        });

        var parts = type.split('');
        $scope.area = strings[parts[0]] + ' ' + strings[parts[1]];
      });
    };

    $scope.getClass = function(flight) {
      var status = $scope.getStatus(flight);
      if (status === 'Aterrizo' || status === 'Despego') {
        return 'success';
      } else if (status === 'Demorado' || status === 'Adelantado') {
        return 'warning';
      } else if (status === 'Cancelado') {
        return 'danger';
      } else if (status === '') {
        return '';
      } else {
        return 'info';
      }
    };

    $scope.getStatus = function(flight) {
      return flight['status-es'];
    };

    $scope.showInfo = function(flight) {
      document.querySelector('#info').className = 'current';
      document.querySelector('[data-position="current"]').className = 'left';
      $scope.flightInfo = flight;
      $scope.flightInfoString = ($scope.type.indexOf('L') === 0) ? 'Origen' : 'Destino';
    };

    $scope.backInfo = function() {
      document.querySelector('#info').className = 'right';
      document.querySelector('[data-position="current"]').className = 'current';
    };

    $scope.search = function() {
      document.querySelector('#normal').classList.add('hidden');
      document.querySelector('#search').classList.remove('hidden');
      document.querySelector('#query').focus();
    };

    $scope.backSearch = function() {
      if (document.querySelector('#query').value !== '') {
        $scope.query.Vuelo = '';
      }
      document.querySelector('#search').classList.add('hidden');
      document.querySelector('#normal').classList.remove('hidden');
    };

    $scope.getAltImage = function(string) {
      var alt = string;
      if (string.length > 15) {
        alt = string.substring(0, 14);
      }
      return alt;
    };

    body.addEventListener('transitionend', function() {
      if (body.clientHeight <= 230) {
        ads.hidden = true;
        $(table).css("margin-bottom", "0");
      } else {
        ads.hidden = false;
        $(table).css("margin-bottom", "100px");
      }
    });

    // List by default
    $scope.change('LI');
    // To avoid console errors
    $scope.flightInfo = {scheduleIime: '', airlineCode: '', flightNumber: '', location: '', gate: '', statusEs: ''};
  }
);
