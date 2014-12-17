'use strict';

angular.module('EPBUY')
    .controller('DetailCtrl', function ($scope, $timeout, $ionicScrollDelegate, Util) {

        $scope.titleName = '我是商品名称';

        function spanSlide(index) {
            $scope.tabIndex = index;
            $scope.tabSlide = {
                'left': $scope.tabIndex ? ($scope.tabIndex * 50 + '%') : '0'
            };
        }

        $scope.switchTab = function (index) {
            spanSlide(index);
            $ionicScrollDelegate.$getByHandle('contentHandle').scrollBottom(true);
        };

        Util.ajaxRequest({
            url: 'GetHomeRestaurantBannerInfo',
            data: {
                enterpriseCode: $scope.enterpriseCode // todo...
            },
            success: function (data) {

                $scope.hasCollection = false;
                $scope.tabIndex = 1;
                spanSlide($scope.tabIndex);
                $scope.goodsPictureList = data.commentList; //取数据 todo...
                $timeout(function () { // 给幻灯片补充样式
                    $scope.specialList = true;
                }, 100);
            }
        });

    });