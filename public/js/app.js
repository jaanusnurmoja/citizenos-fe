'use strict';

/**
 *  Angular App
 *
 *  @see https://angularjs.org/
 */

var app = angular.module('citizenos', ['ngRoute', 'ngTouch']);

app.config(function($routeProvider, $locationProvider) {

	$locationProvider.html5Mode(true);

	$routeProvider
		.when('/', {
			controller: 'home',
			templateUrl: '../views/no_topics.html'
		})

	
});

/* Set global w_width variable for responsive dom hiding */
app.directive('resize', function ($window, $rootScope) {
    return function (scope, element) {
		
        var w = angular.element($window);
        scope.getWindowDimensions = function () {
            return {
                'w': window.innerWidth
            };
        };
		
        scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
			$rootScope.w_width = newValue.w;
        }, true);

        w.bind('resize', function () {
            scope.$apply();
        });
    }
});



app.controller('home', ['$rootScope', function($rootScope) {



}]);