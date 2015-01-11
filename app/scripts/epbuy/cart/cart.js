'use strict';

angular.module('EPBUY')
    .controller('CartCtrl', function ($rootScope, $scope, $state, $ionicPopup, $timeout, $ionicScrollDelegate, DataCachePool) {

        $scope.cartNum = 0;
        $scope.cartPrice = 0;

        $scope.totalNumber = function (n, p) { // 计算商品总&总价\
            var price = 0;
            if (angular.isArray(n)) {
                for (var i = 0; i < n.length; i++) {
                    $scope.cartNum += n[i].Count;
                    price += n[i].InnerPrice * n[i].Count;
                }
            } else {
                $scope.cartNum = p ? $scope.cartNum + 1 : $scope.cartNum - 1;
                price = p ? $scope.cartPrice + n : $scope.cartPrice - n;
            }
            $scope.cartPrice = Math.round(price * 100) / 100;
        };

        var shoppingCart = DataCachePool.pull('SHOPPING_CART');

        if (shoppingCart && shoppingCart.length > 0) {
            $scope.totalNumber(shoppingCart);
            $scope.shoppingCartList = shoppingCart;

            $scope.shoppingCartList[0].NumPurchasing = 10;
        } else {
            $ionicPopup.alert({
                template: '购物车为空，请返回',
                buttons: [{
                    text: '朕知道了',
                    type: 'button-positive',
                    onTap: function () {
                        $state.go('epbuy.home');
                    }
                }]
            });
        }

        var hasChosenList = ''; // 多选待删除的数组

        $scope.hasChosenItem = function (e, index) {
            var el = angular.element(e.target);
            if (el.attr('checked') === 'checked') {
                hasChosenList += index;
            } else {
                hasChosenList = hasChosenList.replace(index, '');
            }
        };

        $scope.deleteGoods = function (str) { // 删除数组

            if (!str) {
                return false;
            }

            var tempArr = [],
                deleteArr = [];

            for (var i = 0; i < $scope.shoppingCartList.length; i++) {
                var isExist = new RegExp(i).test(str);
                if (isExist) {
                    $scope.shoppingCartList[i].removing = true;
                    deleteArr.push($scope.shoppingCartList[i]);
                } else {
                    if (!$scope.shoppingCartList[i].removing) {
                        tempArr.push($scope.shoppingCartList[i]);
                    }
                }
            }

            $timeout(function () {

                $scope.cartNum = 0;
                $scope.cartPrice = 0;
                $scope.totalNumber(tempArr);

                if (tempArr.length > 0) {
                    DataCachePool.push('SHOPPING_CART', tempArr);
                    shoppingCart = tempArr;
                } else {
                    DataCachePool.remove('SHOPPING_CART');
                    $ionicPopup.alert({
                        template: '购物车为空，请返回',
                        buttons: [{
                            text: '朕知道了',
                            type: 'button-positive',
                            onTap: function () {
                                $state.go('epbuy.home');
                            }
                        }]
                    });
                }

                for (var i = 0; i < deleteArr.length; i++) { //移除隐藏元素
                    deleteArr[i].removed = true;
                }

            }, 300);
        };

        $scope.deleteMoreGoods = function (e) {
            var el = angular.element(e.target);

            if (el.text() === '编辑') {
                el.text('删除');
                $scope.moreGoodsChoos = true;
                hasChosenList = '';

            } else {
                el.text('编辑');
                $scope.moreGoodsChoos = false;
                $timeout(function () {
                    $scope.deleteGoods(hasChosenList);
                }, 300);
            }
        };

        $scope.goOrder = function () {
            DataCachePool.push('SHOPPING_CART', shoppingCart);
            $rootScope.orderId = 1;
            $state.go('epbuy.order');
        };

    });