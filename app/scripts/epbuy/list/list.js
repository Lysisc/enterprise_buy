'use strict';

angular.module('EPBUY')
    .controller('ListCtrl', function ($scope, $cacheFactory, $ionicScrollDelegate, $timeout, Util) {

        $scope.isSingle = true; //初始化单列列表
        $scope.priceUp = true; //初始化价格升序
        $scope.discountUp = true; //初始化折扣升序
        $scope.pageIndex = 1; //初始化第一页

        $scope.searchType = 'detail'; // 列表页搜索接口类型定义
        $scope.bottomBarCur = 'home';

        function renderData() {
            Util.ajaxRequest({
                url: 'GetHomeRestaurantBannerInfo',
                data: {

                    enterpriseCode: $scope.enterpriseCode // todo...
                },
                success: function (data) {

                    if (data.commentList && data.commentList.length > 0) {

                        // $cacheFactory('listData', data);

                        $scope.productList = data.commentList; //取数据 todo...
                    }

                }
            });
        }

        renderData();

        // var listData = $cacheFactory.get('listData');

        // if (listData && listData.info().commentList) {
        //     $scope.productList = listData.info().commentList; //取缓存数据
        // } else {
        //     renderData();
        // }

        $scope.pageLoad = function () {
            // alert(1);
            $scope.pageIndex++;
            renderData();
        };

        $scope.filtersCtrl = function (type) {
            switch (type) {
            case 'brand': //品牌

                console.log(type);
                renderData();

                break;
            case 'price': //价格

                if ($scope.priceUp) {
                    $scope.priceUp = false;
                } else {
                    $scope.priceUp = true;
                }

                renderData();

                break;
            case 'discount': //折扣

                if ($scope.discountUp) {
                    $scope.discountUp = false;
                } else {
                    $scope.discountUp = true;
                }

                renderData();

                break;
            default:
                $ionicScrollDelegate.$getByHandle('listScroll').scrollTo(0, 0, true);
                if ($scope.isSingle) {
                    $scope.isSingle = false;
                } else {
                    $scope.isSingle = true;
                }
            }
        };

    });
