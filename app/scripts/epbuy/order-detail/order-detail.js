'use strict';

angular.module('EPBUY')
    .controller('OrderDetailCtrl', function ($scope, $state, Util, DataCachePool) {

        Util.ajaxRequest({
            url: '$server/Myself/GetOrderDetail',
            data: {
                Auth: DataCachePool.pull('USERAUTH')
            },
            success: function (data) {

                $scope.goodsList = data.commentList;

            },
            error: function (data) {
                $scope.noNetwork = true;
            }
        });

        $scope.goOrder = function () {
            $state.go('epbuy.order', {
                OrderId: 1234
            });
        };

    });