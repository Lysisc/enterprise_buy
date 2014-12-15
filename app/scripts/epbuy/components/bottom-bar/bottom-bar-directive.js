'use strict';

angular.module('EPBUY')
	.directive('bottomBar', function ($state) {
		return {
			restrict: 'E',
			templateUrl: 'scripts/epbuy/components/bottom-bar/bottom-bar.html',
			controller: function ($scope) {}
		};
	});