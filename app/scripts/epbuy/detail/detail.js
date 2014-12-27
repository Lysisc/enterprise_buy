'use strict';

angular.module('EPBUY')
    .controller('DetailCtrl', function ($scope, $state, $stateParams, $timeout, $ionicScrollDelegate, Util) {

        console.log($stateParams.GoodsId);

        $scope.isWant = $state.is('epbuy.want');

        if ($scope.isWant) { //底部bar高亮判断
            $scope.bottomBarCur = 'heart';
        } else {
            $scope.bottomBarCur = 'home';
        }

        function spanSlide(index) {
            $scope.tabIndex = index;
            $scope.tabSlide = {
                'left': $scope.tabIndex ? ($scope.tabIndex * 50 + '%') : '0'
            };
        }

        Util.ajaxRequest({
            url: '$local/GetHomeRestaurantBannerInfo.json',
            data: {
                enterpriseCode: $stateParams.GoodsId // todo...
            },
            success: function (data) {

                $scope.titleName = '我是商品名称';

                $scope.hasCollection = false;
                $scope.tabIndex = 1;
                spanSlide($scope.tabIndex);
                $scope.goodsPictureList = data.commentList; //取数据 todo...
                $timeout(function () { // 给幻灯片补充样式
                    $scope.specialList = true;
                }, 100);
            }
        });

        $scope.switchTab = function (index) {
            spanSlide(index);
            $ionicScrollDelegate.$getByHandle('contentHandle').scrollBottom(true);
        };

        $scope.addToCart = function () {
            //todo...加入购物车
        };

        $scope.wantToHeart = function (goodsId) {
            if ($scope.hasHeart) {
                return;
            }

            Util.ajaxRequest({
                url: '$local/GetHomeRestaurantBannerInfo.json',
                data: {
                    enterpriseCode: goodsId // todo...
                },
                success: function (data) {
                    
                    $scope.hasHeart = true; // todo...

                }
            });

        };

    });