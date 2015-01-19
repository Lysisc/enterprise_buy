'use strict';

angular.module('EPBUY')
    .controller('AddressCtrl', function ($rootScope, $scope, $state, $stateParams, $window, Util, DataCachePool) {

        $scope.isChoice = $state.is('epbuy.choice');
        $scope.tabSwitch = 0;

        $scope.addressCheck = function (type) {
            if (angular.isNumber(type)) {
                $scope.tabSwitch = type;
                if (type === $scope.tabIndex) {
                    $scope.checked = $scope.choicedIndex || 0;
                } else {
                    $scope.checked = -1;
                }
            }
        };

        Util.ajaxRequest({
            url: '$server/Address/GetAddressListByAuth',
            data: {
                Auth: DataCachePool.pull('USERAUTH')
            },
            success: function (data) {

                $scope.noNetwork = false;

                $scope.eList = data.enterpriseAddressList || [];
                $scope.pList = data.personAddressList || [];

                //当选择收货地址时，取order页传过来的id，来确定是否企业或是个人的地址索引
                $scope.addressId = $stateParams.AddressId || 0;

                for (var i = 0; i < $scope.eList.length; i++) {
                    if ($scope.eList[i].Id === $scope.addressId) {
                        $scope.tabIndex = 0;
                        $scope.choicedIndex = i;
                        break;
                    } else if ($scope.eList[i].IsDefault) {
                        $scope.tabIndex = 0;
                        $scope.choicedIndex = i;
                    }
                }

                for (var j = 0; j < $scope.pList.length; j++) {
                    if ($scope.pList[j].Id === $scope.addressId) {
                        $scope.tabIndex = 1;
                        $scope.choicedIndex = j;
                        break;
                    } else if ($scope.pList[j].IsDefault) {
                        $scope.tabIndex = 1;
                        $scope.choicedIndex = j;
                    }
                }

                $scope.addressCheck($scope.tabIndex);
            },
            error: function (data) {
                $scope.noNetwork = true;
            }
        });

        $scope.addressChoice = function (type, index) {
            if (angular.isNumber(type) && angular.isNumber(index)) {
                $scope.tabIndex = type;
                $scope.choicedIndex = index;
                $scope.addressCheck(type);
            }
        };

        $scope.addressEdit = function (isAdd) {
            var obj = {};

            if ($scope.tabIndex === undefined && isAdd === undefined) {
                Util.msgToast('请选择一个地址');
                return;
            } else {
                obj = $scope.tabIndex ? $scope.pList[$scope.choicedIndex] : $scope.eList[$scope.choicedIndex];
                obj.type = $scope.tabIndex;
            }

            if ($scope.isChoice && !angular.isNumber(isAdd)) { // 订单地址选择
                $rootScope.addressObj = obj;
                $window.history.back();
            } else {
                var route = '';
                if (angular.isNumber(isAdd)) { // 添加地址
                    route = isAdd ? 'p-address' : 'e-address';
                    $state.go('epbuy.' + route);
                } else { // 编辑地址

                    if ($scope.tabIndex === 0) { // 目前只能编辑个人地址
                        Util.msgToast('请选择个人地址');
                        return;
                    }

                    route = $scope.tabIndex ? 'p-address' : 'e-address';
                    $state.go('epbuy.' + route, {
                        AddressId: obj.Id || 0 // 拿到对应的地址id
                    });
                }
            }
        };

    });
