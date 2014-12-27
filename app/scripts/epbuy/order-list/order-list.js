'use strict';

angular.module('EPBUY')
    .controller('OrderListCtrl', function ($scope, $state, Util, DataCachePool) {

        // Util.ajaxRequest({
        //     noMask: true,
        //     url: '$server/Account/CheckLogin',
        //     data: {
        //         Auth: DataCachePool.pull('USERAUTH')
        //     },
        //     success: function (data) {
        //         if (data && data.IsLogin) {} else {}
        //     },
        //     error: function (data) {}
        // });

        Util.ajaxRequest({
            url: '$local/GetHomeRestaurantBannerInfo.json',
            data: {
                enterpriseCode: $scope.enterpriseCode // todo...
            },
            success: function (data) {

                console.log('我是确认订单页');
                // todo...
            }
        });

    });