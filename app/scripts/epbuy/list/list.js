'use strict';

angular.module('EPBUY')
    .controller('ListCtrl', function ($scope, $state, $ionicScrollDelegate, $ionicPopup, $timeout, Util) {

        $scope.showSort = false; //初始化筛选列表
        $scope.isSingle = true; //初始化单列列表
        $scope.priceUp = true; //初始化价格升序
        $scope.discountUp = true; //初始化折扣升序
        $scope.pageIndex = 1; //初始化第一页
        $scope.isHeart = $state.is('epbuy.heart');

        if ($scope.isHeart) { //底部bar高亮判断
            $scope.bottomBarCur = 'heart';
            $scope.searchType = 'want'; //列表页搜索接口类型定义
        } else {
            $scope.bottomBarCur = 'home';
            $scope.searchType = 'detail'; //列表页搜索接口类型定义
        }

        function dateSubtract(startDate, endDate) { // 活动时间处理

            var sDate = new Date(Date.parse(startDate.replace(/-/g, '/'))),
                eDate = new Date(Date.parse(endDate.replace(/-/g, '/'))),
                rest = '';

            if (sDate.getTime() > eDate.getTime()) {
                console.log('数据错误，开始日期不能大于结束日期！');
            } else {
                var diff = eDate.getTime() - sDate.getTime(),
                    days = Math.floor(diff / (1000 * 60 * 60 * 24));

                diff = diff - days * (1000 * 60 * 60 * 24);

                var hours = Math.floor(diff / (1000 * 60 * 60));

                diff = diff - hours * (1000 * 60 * 60);

                var minutes = diff / 1000;

                if (parseInt(days, 0)) {
                    rest = days + '天' + hours + '小时';
                } else if (parseInt(hours, 0)) {
                    rest = hours + '小时';
                } else {
                    rest = minutes + '分钟';
                }

                return rest;
            }

        }

        function renderData(sort, isLoading, isMask) {

            $scope.showSort = false;

            Util.ajaxRequest({
                noLoad: isLoading,
                noMask: isMask,
                url: '$local/GetHomeRestaurantBannerInfo.json',
                data: {
                    enterpriseCode: 'abs' // todo...
                },
                success: function (data) {

                    $scope.noNetwork = false;

                    switch (sort) {
                    case 'price':
                        $scope.priceUp = $scope.priceUp ? false : true;
                        break;
                    case 'discount':
                        $scope.discountUp = $scope.discountUp ? false : true;
                        break;
                    }

                    if (data.commentList && data.commentList.length > 0) {

                        $scope.startTime = '2014-12-20 12:43:16'.substr(5, 5);
                        $scope.endTime = '2014-12-22 12:43:16'.substr(5, 5);
                        $scope.restTime = dateSubtract('2014-12-20 12:53:16', '2014-12-22 12:43:16');

                        if (sort) { // 处理筛选&首屏加载

                            $scope.pageIndex = 1;
                            $scope.goodsList = data.commentList; //取数据 todo...
                            $ionicScrollDelegate.$getByHandle('listScroll').scrollTo(0, 0); //刷列表后置顶

                        } else { // 处理翻页

                            if (angular.isArray($scope.goodsList)) {
                                $scope.goodsList = $scope.goodsList.concat(data.commentList); //拼接数据
                                $scope.pageIndex++;

                                $timeout(function () {
                                    $scope.$broadcast('scroll.infiniteScrollComplete');
                                }, 300);

                            } else {
                                console.log('加载错误');
                            }

                        }
                    } else {
                        $scope.noResults = true;
                    }
                },
                error: function (data) {
                    $scope.noNetwork = true;
                }
            });
        }

        renderData(true);

        $scope.loadMore = function () { //翻页加载
            renderData(false, true, true);
        };

        $scope.filtersCtrl = function (type) {
            switch (type) {
            case 'sort': //筛选
                $scope.showSort = $scope.showSort ? false : true;
                $scope.sortPrimarySelected = 0;
                $scope.sortPrimary = $scope.goodsList; //todo...
                $scope.sortSecondary = ['1类', '1类', '1类']; //todo...
                $ionicScrollDelegate.$getByHandle('sortPrimary').scrollTo(0, 0);
                break;
            case 'brand': //品牌
            case 'price': //价格
            case 'discount': //折扣
                renderData(type);
                break;
            default:
                $ionicScrollDelegate.$getByHandle('listScroll').scrollTo(0, 0, true);
                $scope.isSingle = $scope.isSingle ? false : true;
                $scope.showSort = false;
            }
        };

        $scope.sortSelect = function (index) {
            if (typeof index === 'number') {

                $scope.sortPrimarySelected = index;

                var arr = [],
                    num = Math.floor(Math.random() * 10) + 1;

                for (var i = 0; i < num; i++) {
                    arr[i] = index + 1 + '类';
                }

                $scope.sortSecondary = arr;

                $ionicScrollDelegate.$getByHandle('sortSecondary').scrollTo(0, 0, true);
            } else {
                renderData(true);
            }

        };

        $scope.toGoodsDetail = function (goodsId) {
            var router = $scope.isHeart ? 'want' : 'detail';
            $state.go('epbuy.' + router, {
                GoodsId: goodsId
            });
        };

        $scope.wantToHeart = function (index, item) {
            if ($scope.goodsList[index].hasHeart) {
                return;
            }

            Util.ajaxRequest({
                url: 'GetHomeRestaurantBannerInfo',
                data: {
                    enterpriseCode: item.commentPrize // todo...
                },
                success: function (data) {

                    $scope.goodsList[index].hasHeart = true; // todo...
                    $scope.goodsList[index].commentPrize++;

                }
            });

        };

    });