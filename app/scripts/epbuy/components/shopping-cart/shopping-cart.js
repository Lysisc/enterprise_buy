'use strict';

angular.module('EPBUY')
    .directive('shoppingCart', function () {
        return {
            restrict: 'E',
            templateUrl: 'scripts/epbuy/components/shopping-cart/shopping-cart.html',
            controller: function ($rootScope, $scope, $timeout, $ionicPopup, $state, DataCachePool) {
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

                $scope.goShoppingCart = function () {
                    if ($rootScope.shoppingCartNum) {
                        $state.go('epbuy.cart');
                    } else {
                        $ionicPopup.alert({
                            template: '请添加商品至购物车',
                            buttons: [{
                                text: '朕知道了',
                                type: 'button-positive'
                            }]
                        });
                    }
                };

                //取数据
                var shoppingGoods = [{
                    ImgUrl: 'images/default_goods.jpg',
                    Title: '我是商品名称',
                    Note: '我是备注信息我是备注信息我是备注信息我是备注信息',
                    Price: 1451,
                    Limit: 5,
                    Num: 1
                }, {
                    ImgUrl: 'images/default_goods.jpg',
                    Title: '我是商品名称',
                    Note: '我是备注信息我是备注信息我是备注信息我是备注信息',
                    Price: 128,
                    Limit: 10,
                    Num: 2
                }, {
                    ImgUrl: 'images/default_goods.jpg',
                    Title: '我是商品名称',
                    Note: '我是备注信息我是备注信息我是备注信息我是备注信息',
                    Price: 230,
                    Limit: 5,
                    Num: 4
                }, {
                    ImgUrl: 'images/default_goods.jpg',
                    Title: '我是商品名称',
                    Note: '我是备注信息我是备注信息我是备注信息我是备注信息',
                    Price: 137,
                    Limit: 6,
                    Num: 1
                }, {
                    ImgUrl: 'images/default_goods.jpg',
                    Title: '我是商品名称',
                    Note: '我是备注信息我是备注信息我是备注信息我是备注信息',
                    Price: 180,
                    Limit: 3,
                    Num: 1
                }, {
                    ImgUrl: 'images/default_goods.jpg',
                    Title: '我是商品名称',
                    Note: '我是备注信息我是备注信息我是备注信息我是备注信息',
                    Price: 150,
                    Limit: 7,
                    Num: 6
                }, {
                    ImgUrl: 'images/default_goods.jpg',
                    Title: '我是商品名称',
                    Note: '我是备注信息我是备注信息我是备注信息我是备注信息',
                    Price: 130,
                    Limit: 5,
                    Num: 1
                }];

                DataCachePool.push('SHOPPING_CART', shoppingGoods);

            }
        };
    });