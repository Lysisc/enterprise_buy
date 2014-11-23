'use strict';

angular.module('EPBUY')
    .directive('foodsRestlist', function (Util) {
        return {
            restrict: 'E',
            templateUrl: 'scripts/foods/components/foods-restlist/foods-restlist.html',
            controller: function ($scope) {
                $scope.formatRestaurantName = Util.formatRestaurantName;
            }
        };
    });
