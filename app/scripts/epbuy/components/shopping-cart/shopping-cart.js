'use strict';

angular.module('EPBUY')
    .directive('shoppingCart', function () {
        return {
            restrict: 'E',
            templateUrl: 'scripts/epbuy/components/shopping-cart/shopping-cart.html',
            controller: function ($scope, $timeout, $ionicPopup, $state, Util, DataCachePool) {

                $timeout(function () {
                    $scope.shoppingCart = DataCachePool.pull('SHOPPING_CART') || [];
                    $scope.shoppingCartNum = 0;
                    for (var i = 0; i < $scope.shoppingCart.length; i++) {
                        $scope.shoppingCartNum += $scope.shoppingCart[i].Count;
                    }
                }, 200);

                $scope.addToCart = function (e, goodsObj) {
                    var $this = angular.element(e.target);

                    if ($this.hasClass('disabled')) {
                        return;
                    }

                    $this.addClass('disabled');

                    for (var i = 0; i < $scope.shoppingCart.length; i++) { // 用于详情页判断是否已加入购物车
                        if ($scope.shoppingCart[i].Id === goodsObj.ProductID) {
                            Util.msgToast('已加入购物车');
                            return;
                        }
                    }

                    var obj = {
                        Id: goodsObj.ProductID,
                        Name: goodsObj.Name,
                        Picture: goodsObj.Picture,
                        InnerPrice: goodsObj.InnerPrice,
                        Remark: goodsObj.Remark,
                        NumPurchasing: goodsObj.NumPurchasing,
                        SpecificationIds: $scope.specificationId,
                        Count: 1
                    };

                    $scope.shoppingCartNum++;
                    $scope.shoppingCart.push(obj);
                    console.log($scope.shoppingCart);
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

            }
        };
    });
