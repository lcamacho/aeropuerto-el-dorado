'use strict';

/**
 * @ngdoc overview
 * @name aeropuertoElDoradoApp
 * @description
 * # aeropuertoElDoradoApp
 *
 * Main module of the application.
 */
angular
  .module('aeropuertoElDoradoApp', [
    'ngTouch',
    'ngLodash'
  ])
  .value('baseURL', 'http://eldorado.aero/wp-content');
