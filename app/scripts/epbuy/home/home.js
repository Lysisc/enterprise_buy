'use strict';

angular.module('EPBUY')
    .controller('HomeCtrl', function ($scope, $cacheFactory, $q, Util) {

        $scope.bottomBarCur = 'home';
        $scope.shoppingCart = 0;
        $scope.searchObj = {};

        var homeData = $cacheFactory.get('homeData');

        if (homeData) {
            $scope.productList = homeData.info().commentList; //取缓存数据
        } else {
            Util.ajaxRequest({
                url: 'GetHomeRestaurantBannerInfo',
                success: function (data) {

                    $cacheFactory('homeData', data);

                    $scope.shoppingCart = 11;
                    $scope.productList = data.commentList; //取数据 todo...

                    if ($scope.productList && $scope.productList.length > 0) {
                        $scope.hasActivity = true;
                    }

                }
            });
        }

        $scope.showSearch = function () {
            $scope.searchObj.searchVal = null;
            $scope.searchResultList = false;
            if ($scope.searching) {
                $scope.searching = false;
            } else {
                $scope.searching = true;
            }
        };

        $scope.searchChange = function () {
            // body...
        };

        $scope.onScroll = function () {};

    });
