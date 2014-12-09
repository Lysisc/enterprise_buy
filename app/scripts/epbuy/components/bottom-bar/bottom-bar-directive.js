'use strict';

angular.module('EPBUY')
    .directive('bottomBar', function () {
        return {
            restrict: 'E',
            templateUrl: 'scripts/epbuy/components/bottom-bar/bottom-bar.html',
            controller: function ($scope) {}
        };
    });
