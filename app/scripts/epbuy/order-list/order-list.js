'use strict';

angular.module('EPBUY')
    .controller('OrderListCtrl', function ($scope, $state, $location, Util, DataCachePool) {

        if ($location.search() && $location.search().type) {
            var type = $location.search().type;
            switch (type) {
            case 'pay':
                $scope.orderListTitle = '代付款';
                break;
            case 'rec':
                $scope.orderListTitle = '代收货';
                break;
            default:
                $scope.orderListTitle = '全部';
            }
        } else {
            $scope.orderListTitle = '全部';
        }

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