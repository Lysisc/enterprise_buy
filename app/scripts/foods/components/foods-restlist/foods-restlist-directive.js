'use strict';

angular.module('GSH5')
  .directive('foodsRestlist', function(Util) {
    return {
      restrict: 'E',
      templateUrl: 'scripts/foods/components/foods-restlist/foods-restlist.html',
      controller: function($scope) {
        $scope.formatRestaurantName = Util.formatRestaurantName;
      }
    };
  });
