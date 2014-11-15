'use strict';

angular.module('GSH5')
  .directive('expandableText', function () {
    return {
      restrict: 'E',
      templateUrl: 'scripts/foods/components/expandable-text/expandable-text.html',
      scope: {
        gsContent: '@',
        gsCount: '@'
      },
      controller: function ($scope) {
        $scope.Infinity = Infinity;
        $scope.currCount = $scope.gsCount;
        $scope.goInfinity = function (e) {
          var $specArticle = angular.element(e.target).parent().parent(),
            isSpecArticle = $specArticle.hasClass('special_text');
          if (isSpecArticle) {
            $specArticle.addClass('slide-down');
          }
          $scope.currCount = Infinity;
        };
        $scope.goGsCount = function (e) {
          var $specArticle = angular.element(e.target).parent().parent(),
            isSpecArticle = $specArticle.hasClass('special_text');
          if (isSpecArticle) {
            $specArticle.removeClass('slide-down');
          }
          $scope.currCount = $scope.gsCount;
        };
      }
    };
  });
