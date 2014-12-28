'use strict';

angular.module('EPBUY')
    .controller('EditAddressCtrl', function ($rootScope, $scope, $state, $location, $ionicPopup, $stateParams, $window, Util, AREA) {

        $scope.addressId = $stateParams.AddressId;
        $scope.inputVal = {}; //初始化所有输入选择model
        $scope.inputVal.addressType = $state.is('epbuy.p-address') ? 1 : 0;

        $scope.getArea = function (province, city, district) {

            if ($scope.inputVal.addressType) {
                if (!province && !city && !district) {
                    $scope.area = new AREA.GetArea();
                } else if (!city && !district) {
                    $scope.inputVal.city = null;
                    $scope.inputVal.district = null;
                    $scope.area.getCity(province);
                } else if (!district) {
                    $scope.inputVal.district = null;
                    $scope.area.getDistrict(city);
                }

            }

        };

        if ($scope.addressId) {

            Util.ajaxRequest({
                url: '$local/GetHomeRestaurantBannerInfo.json',
                data: {
                    enterpriseCode: $scope.enterpriseCode // todo...
                },
                success: function (data) {
                    if (true) {
                        $scope.title = '个人';
                        $scope.inputVal.addressType = 1;
                        $scope.inputVal.province = '北京市';
                        $scope.inputVal.city = '市辖区';
                        $scope.inputVal.district = '市辖区';
                        $scope.area = new AREA.GetArea($scope.inputVal.province, $scope.inputVal.city, $scope.inputVal.district);
                    } else {
                        $scope.title = '企业';
                    }
                }
            });

            $scope.deleteAddress = function () {
                $ionicPopup.alert({
                    template: '确定要删除该地址吗？',
                    buttons: [{
                        text: '确定',
                        type: 'button-positive',
                        onTap: function () {
                            Util.ajaxRequest({
                                isPopup: true,
                                url: '$local/GetHomeRestaurantBannerInfo.json',
                                data: {
                                    enterpriseCode: $scope.addressId // todo...
                                },
                                success: function (data) {
                                    $window.history.back();
                                },
                                error: function (data) {
                                    Util.msgToast($scope, '删除失败，请重试或查看网络');
                                }
                            });
                        }
                    }]
                });
            };

        } else {
            $scope.getArea();
        }

        $scope.saveAddress = function () {
            if (!$scope.inputVal.consignee) {
                Util.msgToast($scope, '请输入收货人姓名');
                return;
            }

            if (!$scope.inputVal.phoneNumber) {
                Util.msgToast($scope, '请输入手机号码');
                return;
            }

            if (!/^1[3|4|5|8][0-9]\d{4,8}$/.test($scope.inputVal.phoneNumber)) {
                Util.msgToast($scope, '联系手机格式不合法');
                return;
            }

            if ($scope.inputVal.addressType) {
                if (!$scope.inputVal.province) {
                    Util.msgToast($scope, '请选择所在省');
                    return;
                }

                if (!$scope.inputVal.city || $scope.inputVal.city === '选择市') {
                    Util.msgToast($scope, '请选择所在市');
                    return;
                }

                if (!$scope.inputVal.district) {
                    Util.msgToast($scope, '请选择所在区');
                    return;
                }

                if (!$scope.inputVal.detailedAddress) {
                    Util.msgToast($scope, '请输入详细地址');
                    return;
                }
            }

            Util.ajaxRequest({
                url: '$local/GetHomeRestaurantBannerInfo.json',
                data: {
                    enterpriseCode: $scope.enterpriseCode // todo...
                },
                success: function (data) {
                    $window.history.back();
                }
            });
        };

    });