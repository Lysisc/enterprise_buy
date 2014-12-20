'use strict';

angular.module('EPBUY')
    .controller('EditAddressCtrl', function ($rootScope, $scope, $location, $stateParams, $window, Util) {

        $scope.addressId = $stateParams.AddressId;
        $scope.addressType = parseInt($stateParams.type, 0) || 0;

        if ($scope.addressId) {
            Util.ajaxRequest({
                url: 'GetHomeRestaurantBannerInfo',
                data: {
                    enterpriseCode: $scope.enterpriseCode // todo...
                },
                success: function (data) {
                    if (true) {
                        $scope.title = '个人';
                    } else {
                        $scope.title = '企业';
                    }
                }
            });
        }

    });