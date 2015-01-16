'use strict';

angular.module('EPBUY')
    .controller('OrderCtrl', function ($rootScope, $scope, $state, $stateParams, $ionicPopup, Util, DataCachePool) {

        var shoppingCart = DataCachePool.pull('SHOPPING_CART');

        if (!shoppingCart || shoppingCart.length === 0) {
            $ionicPopup.alert({
                template: '购物车为空，请去添加',
                buttons: [{
                    text: '朕知道了',
                    type: 'button-positive',
                    onTap: function () {
                        $state.go('epbuy.home');
                    }
                }]
            });
            return;
        }

        $scope.cartNum = 0;
        $scope.cartPrice = 0;

        var price = 0;
        for (var i = 0; i < shoppingCart.length; i++) {
            $scope.cartNum += shoppingCart[i].Count;
            price += shoppingCart[i].InnerPrice * shoppingCart[i].Count;
        }
        $scope.cartPrice = Math.round(price * 100) / 100;

        $scope.checkVal = {};
        $scope.checkVal.receiving = '周一至周日全天';

        // var jmz = {}; //js判断字符串长度（含中文）
        // jmz.GetLength = function (str) {
        //     ///<summary>获得字符串实际长度，中文2，英文1</summary>
        //     ///<param name="str">要获得长度的字符串</param>
        //     var realLength = 0,
        //         len = str.length,
        //         charCode = -1;
        //     for (var i = 0; i < len; i++) {
        //         charCode = str.charCodeAt(i);
        //         if (charCode >= 0 && charCode <= 128) realLength += 1;
        //         else realLength += 2;
        //     }
        //     return realLength;
        // };

        $scope.address = $rootScope.addressObj || DataCachePool.pull('DEFAULT_ADDRESS');

        if ($scope.address) { //当选好地址或者有默认地址时，请求接口拿到优惠信息

            var productList = [];

            for (var j = 0; j < shoppingCart.length; j++) {
                productList.push({
                    Id: shoppingCart[j].Id,
                    Count: shoppingCart[j].Count,
                    SpecificationIds: shoppingCart[j].SpecificationIds
                });
            }

            Util.ajaxRequest({
                isForm: true,
                isPopup: true,
                method: 'POST',
                url: '$server/Order/CaculateOrder',
                data: {
                    Auth: DataCachePool.pull('USERAUTH'),
                    CaculateOrder: {
                        AddressId: $scope.address.Id,
                        ProductList: productList
                    }
                },
                success: function (data) {
                    if (data.state === 200) {
                        $scope.deliveryWayList = data.DeliveryWayList || [];
                        $scope.favoritePlanList = data.FavoritePlanList || [];
                        $scope.checkVal.delivery = $scope.deliveryWayList[0];
                    } else {
                        $ionicPopup.confirm({
                            template: '该地址不支持配送，请重新选择',
                            cancelText: '取消',
                            okText: '确定'
                        }).then(function (res) {
                            if (res) {
                                $scope.toAdress($scope.address.Id);
                            }
                        });
                    }
                }
            });
        }

        $scope.toAdress = function (addressId) {
            $state.go('epbuy.choice', {
                AddressId: addressId
            });
        };

        $scope.checkRemark = function (e, remark) { // 备注要求
            var el = angular.element(e.target),
                text = el.val();

            if (!text) {
                return;
            }

            if (remark) {
                $scope.remark = text;
                el.parent().find('p').text(text);
            } else {
                $scope.remark = 1;
                el.parent().find('p').text('请不要超过100个字');
            }
        };

        $scope.placeTheOrder = function () {
            if (!$scope.address) {
                Util.msgToast('请添加收货地址');
                return;
            }

            if (!$scope.checkVal.delivery || $scope.checkVal.delivery.id) {
                Util.msgToast('您还没有选择配送方式');
                return;
            }

            if ($scope.remark === 1) {
                Util.msgToast('备注超过100个字，请删减');
                return;
            }

            if ($rootScope.orderId !== 1) {
                $ionicPopup.alert({
                    template: '不能重复提交订单',
                    buttons: [{
                        text: '朕知道了',
                        type: 'button-positive',
                        onTap: function () {
                            $state.go('epbuy.home');
                        }
                    }]
                });
                return;
            }

            Util.ajaxRequest({
                isPopup: true,
                isForm: true,
                method: 'POST',
                url: '$server/Order/AddOrder',
                data: {
                    Auth: DataCachePool.pull('USERAUTH'),
                    DeliveryWayId: $scope.checkVal.delivery.Id,
                    ReceiptTime: $scope.checkVal.receiving,
                    Note: $scope.remark,
                    CaculateOrder: {
                        AddressId: $scope.address.Id,
                        ProductList: productList
                    }
                },
                success: function (data) {
                    if (data.state === 200) {
                        DataCachePool.remove('SHOPPING_CART');
                        DataCachePool.push('DEFAULT_ADDRESS', {
                            Data: $scope.address
                        });
                        $rootScope.orderId = data.Id;
                        $state.go('epbuy.payment', {
                            OrderId: data.Id
                        });
                    } else if (data.state === 808) {
                        $ionicPopup.confirm({
                            template: '该地址不支持配送，请重新选择',
                            cancelText: '取消',
                            okText: '确定'
                        }).then(function (res) {
                            if (res) {
                                $scope.toAdress($scope.address.Id);
                            }
                        });
                    } else {
                        Util.msgToast(data.msg);
                    }
                }
            });
        };

    });
