'use strict';

angular.module('EPBUY')
    .directive('shoppingCart', function () {
        return {
            restrict: 'E',
            templateUrl: 'scripts/epbuy/components/shopping-cart/shopping-cart.html',
            controller: function ($rootScope, $scope, $timeout) {
                $rootScope.shoppingCartShow = false;
                $timeout(function () {

                    $rootScope.shoppingCartShow = true;
                    $rootScope.shoppingCartNum = 11; //todo...取locaStorage数据

                }, 200);

                $scope.addToCart = function () {
                    if (!$scope.hasAdded) {
                        $scope.hasAdded = true;
                        $rootScope.shoppingCartNum++;
                        //todo...
                    }
                };
            }
        };
    });