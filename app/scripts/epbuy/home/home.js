'use strict';

angular.module('EPBUY')
    .controller('HomeCtrl', function ($scope, $state, $cacheFactory, Util) {

        $scope.searchType = 'detail';
        $scope.bottomBarCur = 'home';

        var homeData = $cacheFactory.get('homeData');

        if (homeData && homeData.info().commentList) {
            $scope.hasActivity = true;
            $scope.bannerList = homeData.info().commentList; //取缓存数据
            $scope.goodsList = homeData.info().commentList; //取缓存数据
        } else {
            Util.ajaxRequest({
                url: 'GetHomeRestaurantBannerInfo',
                data: {
                    enterpriseCode: $scope.enterpriseCode // todo...
                },
                success: function (data) {

                    if (data.commentList && data.commentList.length > 0) {
                        $scope.hasActivity = true;

                        $cacheFactory('homeData', data);

                        $scope.bannerList = data.commentList;

                        $scope.goodsList = data.commentList; //取数据 todo...
                    }

                }
            });
        }

    });