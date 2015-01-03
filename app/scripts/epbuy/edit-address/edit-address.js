'use strict';

angular.module('EPBUY')
    .controller('EditAddressCtrl', function ($scope, $state, $location, $timeout, $ionicPopup, $stateParams, $window, Util, DataCachePool) {

        $scope.addressId = $stateParams.AddressId;
        $scope.inputVal = {}; //初始化所有输入选择model
        $scope.inputVal.addressType = $state.is('epbuy.p-address') ? 1 : 0;

        $scope.getArea = function (areaId, level) {

            $scope.inputVal.addressType = parseInt($scope.inputVal.addressType, 0);

            if ($scope.inputVal.addressType) {

                if (level) {
                    Util.ajaxRequest({
                        url: '$server/Address/GetSubAreaList',
                        data: {
                            Auth: DataCachePool.pull('USERAUTH'),
                            Id: areaId
                        },
                        success: function (data) {
                            if (level === 1) {

                                $scope.province = data.AreaList;

                            } else if (level === 2) {

                                $scope.inputVal.cityId = '';
                                $scope.village = false;
                                if (areaId) {
                                    $scope.city = data.AreaList;
                                } else {
                                    $scope.city = false;
                                }

                            } else if (level === 3) {

                                $scope.inputVal.villageId = '';
                                if (areaId) {
                                    $scope.village = data.AreaList;
                                } else {
                                    $scope.village = false;
                                }

                            }

                            $scope.selectedAreaId = areaId;
                        }
                    });

                } else {
                    $scope.selectedAreaId = areaId;
                }

            } else {
                $scope.inputVal.provinceId = '';
                $scope.inputVal.cityId = '';
                $scope.inputVal.villageId = '';
            }
        };

        if ($scope.addressId) {

            Util.ajaxRequest({
                url: '$server/Address/GetAddressByAddressID',
                data: {
                    Auth: DataCachePool.pull('USERAUTH'),
                    AddressId: $scope.addressId
                },
                success: function (data) {

                    $scope.getArea('', 1);

                    if ($scope.inputVal.addressType) {
                        $scope.editAddressTitle = '个人';
                        $scope.inputVal.addressType = 1;
                    } else {
                        $scope.editAddressTitle = '企业';
                    }
                }
            });

            $scope.deleteAddress = function () {
                $ionicPopup.confirm({
                    template: '确定要删除该地址吗？',
                    cancelText: '取消',
                    okText: '确定'
                }).then(function (res) {
                    if (res) {

                        Util.ajaxRequest({
                            url: '$server/Address/AddressDelete',
                            data: {
                                Auth: DataCachePool.pull('USERAUTH'),
                                AddressId: $scope.addressId
                            },
                            success: function (data) {
                                if (data.state === 200) {
                                    $window.history.back();
                                }
                            },
                            error: function (data) {
                                Util.msgToast('删除失败，请重试或查看网络');
                            }
                        });

                    }
                });
            };

        } else {
            $scope.getArea('', 1);
            $scope.inputVal.provinceId = '';
            $scope.inputVal.cityId = '';
            $scope.inputVal.villageId = '';
        }

        $scope.saveAddress = function () {
            if (!$scope.inputVal.consignee) {
                Util.msgToast('请输入收货人姓名');
                return;
            }

            if (!$scope.inputVal.phoneNumber) {
                Util.msgToast('请输入手机号码');
                return;
            }

            if (!/^1[3|4|5|8][0-9]\d{4,8}$/.test($scope.inputVal.phoneNumber)) {
                Util.msgToast('联系手机格式不合法');
                return;
            }

            if ($scope.inputVal.addressType) {

                if (!$scope.inputVal.provinceId) {
                    Util.msgToast('请选择所在省');
                    return;
                }

                if (!$scope.inputVal.cityId) {
                    Util.msgToast('请选择所在市');
                    return;
                }

                if ($scope.village.length > 0 && !$scope.inputVal.villageId) {
                    Util.msgToast('请选择所在区');
                    return;
                }

                if (!$scope.inputVal.detailedAddress) {
                    Util.msgToast('请输入详细地址');
                    return;
                }
            }

            Util.ajaxRequest({
                method: 'POST',
                url: '$server/Address/Address' + ($scope.addressId ? 'Update' : 'Add'),
                data: {
                    Auth: DataCachePool.pull('USERAUTH'),
                    Id: $scope.addressId || '',
                    Name: $scope.inputVal.consignee,
                    Province: $scope.inputVal.provinceId,
                    City: $scope.inputVal.cityId,
                    Village: $scope.inputVal.villageId,
                    AreaId: $scope.selectedAreaId,
                    Address: $scope.inputVal.detailedAddress,
                    Zipcode: $scope.inputVal.zipCode,
                    EmailAddress: '',
                    PhoneNumber: $scope.inputVal.phoneNumber,
                    IsDefault: '',
                    Remark: ''
                },
                success: function (data) {
                    $window.history.back();
                }
            });
        };

    });