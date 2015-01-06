'use strict';

angular.module('EPBUY')
    .directive('shoppingCart', function () {
        return {
            restrict: 'E',
            templateUrl: 'scripts/epbuy/components/shopping-cart/shopping-cart.html',
            controller: function ($scope, $timeout, $ionicPopup, $state, DataCachePool) {

                $timeout(function () {
                    $scope.shoppingCart = DataCachePool.pull('SHOPPING_CART') || [];
                    $scope.shoppingCartNum = 0;
                    for (var i = 0; i < $scope.shoppingCart.length; i++) {
                        $scope.shoppingCartNum += $scope.shoppingCart[i].Num;
                    }
                }, 200);

                $scope.addToCart = function (e, goodsObj) {
                    var $this = angular.element(e.target);

                    if ($this.hasClass('disabled')) {
                        return;
                    }

                    $this.addClass('disabled');

                    $scope.shoppingCartNum++;

                    $scope.shoppingCart.push(goodsObj);
                    DataCachePool.push('SHOPPING_CART', $scope.shoppingCart);

                };

                $scope.goShoppingCart = function () {
                    if ($scope.shoppingCartNum) {
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
                    Id: '20141228155233094911123536fb569',
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