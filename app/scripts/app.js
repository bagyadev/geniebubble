'use strict';

/**
 * @ngdoc overview
 * @name genieBubbleApp
 * @description
 * # genieBubbleApp
 *
 * Main module of the application.
 */
angular
  .module('genieBubbleApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/demo2', {
        templateUrl: 'views/demo2.html',
        controller: 'DemoCtrl',
        controllerAs: 'demo'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
