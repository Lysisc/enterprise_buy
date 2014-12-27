'use strict';

angular.module('EPBUY')
    .controller('HomeCtrl', function ($scope, $state, $cacheFactory, $ionicPopup, Util, DataCachePool) {

        var homeData = $cacheFactory.get('homeData');

        if (homeData && homeData.info().commentList) {
            $scope.hasActivity = true;
            $scope.bannerList = homeData.info().commentList; //取缓存数据
            $scope.goodsList = homeData.info().commentList; //取缓存数据
        } else {
            Util.ajaxRequest({
                isPopup: true,
                url: '$local/GetHomeRestaurantBannerInfo.json',
                data: {
                    Auth: DataCachePool.pull('USERAUTH')
                },
                success: function (data) {
                    if (data.commentList && data.commentList.length > 0) {
                        $scope.hasActivity = true;

                        $cacheFactory('homeData', data);

                        $scope.bannerList = data.commentList;
                        $scope.goodsList = data.commentList; //取数据 todo...

                        if (DataCachePool.pull('STATEMENT') !== 1) {
                            DataCachePool.push('STATEMENT', 1);

                            var statement = '我是活动声明我是活动声明我是活动声明我是活动声明我是活动声明我是活动声明我是活动声明';

                            Util.backDrop.retain();

                            $ionicPopup.alert({
                                template: '<h4>活动声明</h4><ion-scroll>' + statement + '</ion-scroll>',
                                buttons: [{
                                    text: '朕知道了',
                                    type: 'button-positive'
                                }]
                            });
                        }
                    } else {
                        $scope.hasActivity = false;
                        Util.backDrop.release();
                    }

                },
                error: function (data) {
                    $scope.noNetwork = true;
                    Util.backDrop.release();
                }
            });
        }

        $scope.toGoodsDetail = function (goodsId) {
            $state.go('epbuy.detail', {
                GoodsId: goodsId
            });
        };

    });