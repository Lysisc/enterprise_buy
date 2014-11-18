'use strict';

angular.module('EPBUY')
    .directive('foodsBottomfilter', function () {
        return {
            restrict: 'E',
            templateUrl: 'scripts/foods/components/foods-bottomfilter/foods-bottomfilter.html',
            controller: function ($scope) {
                // $http.get('../api/bottomfilter.json').success(function(data) {
                //   $scope.bottomfilter = data;
                // });

                $scope.bfAll = function () {
                    $scope.bfAllSort = $scope.bfAllSort === false ? true : false;
                    if (!!$scope.bfAllSort) {
                        // $scope.SellSort = [];
                        $scope.restPostData.SellSortId = '';
                        $scope.restPostData.PriceSortId = 0;
                        $scope.SceneSort = [];
                        $scope.restPostData.SceneSortId = '';
                    }
                };

                $scope.bfAllFalse = function () {
                    $scope.bfAllSort = false;
                };

                // //类型ID
                // $scope.SellSort = [];
                // if ($scope.restPostData.SellSortId !== '') {
                //   for (var i = 0; i < $scope.restPostData.SellSortId.length; i++) {
                //     $scope.SellSort[$scope.restPostData.SellSortId[i]] = true;
                //   }
                // }
                //情景ID
                $scope.SceneSort = [];
                if ($scope.restPostData.SceneSortId !== '') {
                    for (var j = 0; j < $scope.restPostData.SceneSortId.length; j++) {
                        $scope.SceneSort[$scope.restPostData.SceneSortId[j]] = true;
                    }
                }
            }
        };
    });
