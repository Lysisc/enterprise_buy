'use strict';

angular.module('GSH5')
  .directive('foodsTopfilter', function() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/foods/components/foods-topfilter/foods-topfilter.html',
      controller: function($scope) {
        //区域tab切换
        $scope.areatab = 1;
        $scope.setAreaTab = function(num){
          $scope.areatab = num;
        };
        //背景显示
        $scope.choosebg = false;
        $scope.showchoosebg = function() {
          $scope.choosebg = $scope.choosebg !== true ? true : false;
          $scope.choosetab = 0;
        };

        //美食弹窗2级分类
        $scope.mslist = 0;
        $scope.msCurrentSort = '全部菜系';
        $scope.setSort2 = function(num, sorttext) {
          $scope.msCurrentSort = sorttext;
          $scope.mslist = num;
        };

        //区域弹窗2级分类
        $scope.arealist = 0;
        $scope.setArea = function(num) {
          $scope.arealist = num;
        };

        //地铁弹窗2级分类
        $scope.subwaylist = 0;
        $scope.subwayCurrentSort = '1号线';
        $scope.setSubway = function(num, sorttext) {
          $scope.subwayCurrentSort = sorttext;
          $scope.subwaylist = num;
        };
      }
    };
  });
