'use strict';

angular.module('EPBUY')
    .controller('HomeCtrl', function ($scope, $state, $timeout, $cacheFactory, $ionicPopup, Util, DataCachePool) {

        var homeData = $cacheFactory.get('homeData');

        // if (homeData && homeData.info().commentList) {
        //     $scope.hasActivity = true;
        //     $scope.bannerList = homeData.info().commentList; //取缓存数据
        //     $scope.goodsList = homeData.info().commentList; //取缓存数据
        //     Util.backDrop.release();
        // } else {
        Util.ajaxRequest({ //取banner区数据
            isPopup: true,
            url: '$server/Advertisement/GetHomepageSlideList',
            data: {
                Auth: DataCachePool.pull('USERAUTH')
            },
            success: function (data) {
                $timeout(function () {
                    $scope.bannerList = data.SlideList || [];
                }, 0);
            }
        });

        Util.ajaxRequest({ //取热门区数据
            url: '$server/InternalPurchase/GetActivityProductList',
            data: {
                Auth: DataCachePool.pull('USERAUTH'),
                PageSize: 20,
                PageNo: 1
            },
            success: function (data) {
                if (data.List && data.List.length > 0) {

                    $scope.hasActivity = true;

                    // $cacheFactory('homeData', data);

                    $scope.goodsList = data.List;

                    if (DataCachePool.pull('STATEMENT') !== 1) {

                        var statement = '';

                        Util.ajaxRequest({ //取活动说明文案
                            isPopup: true,
                            url: '$server/InternalPurchase/GetCurActivity',
                            data: {
                                Auth: DataCachePool.pull('USERAUTH')
                            },
                            success: function (data) {

                                if (data.Activity) {
                                    $timeout(function () {
                                        Util.backDrop.retain();
                                    }, 100);
                                    statement = data.Activity.Description || '企福惠欢迎您';
                                } else {
                                    Util.backDrop.release();
                                    return;
                                }

                                var descPopup = $ionicPopup.alert({
                                    template: '<h4>活动声明</h4><ion-scroll>' + statement + '</ion-scroll>',
                                    buttons: [{
                                        text: '朕知道了',
                                        type: 'button-positive',
                                        onTap: function () {
                                            DataCachePool.remove('SHOPPING_CART');
                                            DataCachePool.push('STATEMENT', 1);
                                            descPopup.close();
                                        }
                                    }]
                                });
                            }
                        });

                    }

                } else {
                    DataCachePool.remove('SHOPPING_CART');
                    DataCachePool.remove('STATEMENT');
                    $scope.hasActivity = false;
                }

            },
            error: function (data) {
                $scope.noNetwork = true;
            }
        });
        // }

        $scope.toDetail = function (goodsId, innerId) {
            $state.go('epbuy.detail', {
                GoodsId: goodsId,
                InnerId: innerId
            });
        };

    });
