'use strict';

angular.module('EPBUY')
    .controller('OrderDetailCtrl', function ($scope, $state, Util) {

        Util.ajaxRequest({
            url: '$local/GetHomeRestaurantBannerInfo.json',
            data: {
                enterpriseCode: 'abs' // todo...
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