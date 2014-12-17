'use strict';

angular.module('EPBUY')
    .controller('HomeCtrl', function ($scope, $state, $cacheFactory, $ionicPopup, Util, DataCachePool) {

        $scope.searchType = 'detail';
        $scope.bottomBarCur = 'home';

        var homeData = $cacheFactory.get('homeData');

        if (homeData && homeData.info().commentList) {
            $scope.hasActivity = true;
            $scope.bannerList = homeData.info().commentList; //取缓存数据
            $scope.goodsList = homeData.info().commentList; //取缓存数据
        } else {
            Util.ajaxRequest({
                isPopup: true,
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

                        if (DataCachePool.pull('STATEMENT') !== 1) {

                            var statement = '我是活动声明我是活动声明我是活动声明我是活动声明我是活动声明我是活动声明我是活动声明';

                            Util.backDrop.retain();

                            $ionicPopup.alert({
                                template: '<h4>活动声明</h4><ion-scroll>' + statement + '</ion-scroll>',
                                buttons: [{
                                    text: '朕知道了',
                                    type: 'button-positive'
                                }]
                            });

                            DataCachePool.push('STATEMENT', 1);

                        }

                    }

                }
            });
        }

    });