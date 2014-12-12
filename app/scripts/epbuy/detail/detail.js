'use strict';

angular.module('EPBUY')
    .controller('DetailCtrl', function ($scope, $stateParams, $timeout, $userService, $state, Util) {

        $scope.titleName = '我是商品名称';

        Util.ajaxRequest({
            url: 'GetHomeRestaurantBannerInfo',
            data: {
                enterpriseCode: $scope.enterpriseCode // todo...
            },
            success: function (data) {
                $scope.goodsPictureList = data.commentList; //取数据 todo...
                $timeout(function () { // 给幻灯片补充样式
                    $scope.specialList = true;
                }, 100);
            }
        });

    });