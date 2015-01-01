'use strict';

angular.module('EPBUY')
    .controller('AddressCtrl', function ($rootScope, $scope, $state, $stateParams, $window, Util, DataCachePool) {

        $scope.isChoice = $state.is('epbuy.choice');

        Util.ajaxRequest({
            url: '$server/Account/GetAddressListByAuth',
            data: {
                Auth: DataCachePool.pull('USERAUTH'),
                Id: 0,
                Province: '',
                City: '',
                Village: '',
                AreaId: '',
                Address: '',
                Zipcode: '',
                EmailAddress: '',
                PhoneNumber: '',
                IsDefault: '',
                Remark: ''
            },
            success: function (data) {

                $scope.enterpriseList = data.enterpriseAddressList || [];
                $scope.personageList = data.personAddressList || [];

                //页面右上角‘确定’或‘编辑’是否可用
                if ($scope.enterpriseList.length > 0 && $scope.personageList.length > 0) {
                    $scope.editable = true;
                }

                //当选择收货地址时，取order页传过来的index和type，来确定是否企业或是个人的地址索引
                if ($scope.isChoice) {
                    $scope.choicedIndex = parseInt($stateParams.idx.split('|')[1], 0);
                    $scope.tabIndex = parseInt($stateParams.idx.split('|')[0], 0);
                } else {
                    // $scope.tabIndex = 1;
                    $scope.choicedIndex = 3;
                }

                $scope.addressCheck($scope.tabIndex, $scope.choicedIndex);
            }
        });

        $scope.addressCheck = function (type, index) {
            if (!angular.isNumber(type)) {
                return;
            } else {
                if (type === $scope.tabIndex) {
                    $scope.checked = index || 0;
                } else {
                    $scope.checked = -1;
                }
            }
        };

        $scope.addressChoice = function (type, index) {
            if (!angular.isNumber(type) || !angular.isNumber(index)) {
                return;
            } else {
                $scope.tabIndex = type;
                $scope.choicedIndex = index;
                $scope.addressCheck(type, index);
            }
        };

        $scope.addressEdit = function (isAdd) {
            var type = $scope.tabIndex,
                index = $scope.choicedIndex,
                obj = {};

            if ($scope.editable) {
                obj = type ? $scope.enterpriseList[type] : $scope.personageList[index];
            }

            if ($scope.isChoice && !angular.isNumber(isAdd)) {

                $rootScope.addressObj = {
                    Type: type,
                    Index: index,
                    Obj: obj
                };

                $window.history.back();
            } else {
                var route = '';

                if (angular.isNumber(isAdd)) {
                    route = isAdd ? 'p-address' : 'e-address';
                    $state.go('epbuy.' + route);
                } else {
                    route = type ? 'p-address' : 'e-address';
                    $state.go('epbuy.' + route, {
                        AddressId: obj.AddressId || 0 // 拿到对应的地址id
                    });
                }
            }
        };

    });