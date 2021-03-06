'use strict';

angular.module('EPBUY')
    .controller('ListCtrl', function ($scope, $state, $timeout, $ionicScrollDelegate, $ionicLoading, $ionicPopup, Util, DataCachePool) {

        $scope.isSingle = true; //初始化单列列表
        $scope.priceUp = 'asc'; //初始化价格升序
        $scope.discountUp = 'asc'; //初始化折扣升序
        $scope.pageIndex = 1; //初始化第一页
        $scope.isHeart = $state.is('epbuy.heart');

        if ($scope.isHeart) { //底部bar高亮判断
            $scope.bottomBarCur = 'heart';
            $scope.searchType = 'want'; //列表页搜索接口类型定义

            $scope.wantMore = function () {
                $state.go('epbuy.want-more');
            };

            $scope.wantToHeart = function (index, itemId) {
                if ($scope.goodsList[index].HasVote) {
                    return;
                }

                Util.ajaxRequest({
                    url: '$server/Wish/ProductVote',
                    data: {
                        Auth: DataCachePool.pull('USERAUTH'),
                        ProductId: itemId,
                    },
                    success: function (data) {
                        if (data.state === 200) {
                            $scope.goodsList[index].HasVote = true;
                            $scope.goodsList[index].VoteCount++;
                        } else {
                            Util.msgToast(data.msg);
                        }
                    },
                    error: function () {
                        Util.msgToast('投票失败，请查看网络');
                    }
                });
            };

        } else {
            $scope.bottomBarCur = 'home';
            $scope.searchType = 'detail'; //列表页搜索接口类型定义
        }

        function dateSubtract(endDate) { // 活动时间处理

            var sDate = Date.now(),
                eDate = new Date(Date.parse(endDate.replace(/-/g, '/'))),
                rest = '';

            if (sDate > eDate.getTime()) {
                console.log('数据错误，开始日期不能大于结束日期！');
            } else {
                var diff = eDate.getTime() - sDate,
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

        function renderData(sort) {

            $scope.showSort = false;
            $scope.showBrand = false;
            $scope.pageIndex = sort ? 1 : $scope.pageIndex;

            if (sort) { //处理筛选
                switch (sort) {
                case 'price':
                    $scope.priceUp = $scope.priceUp === 'asc' ? 'desc' : 'asc';
                    break;
                case 'discount':
                    $scope.discountUp = $scope.discountUp === 'asc' ? 'desc' : 'asc';
                    break;
                }
                $ionicScrollDelegate.$getByHandle('listScroll').scrollTo(0, 0); //刷列表后置顶
            }

            Util.ajaxRequest({
                noMask: !sort,
                url: '$server/' + ($scope.isHeart ? 'Wish/GetWantMoreProductList' : 'InternalPurchase/GetActivityProductList'),
                data: {
                    Auth: DataCachePool.pull('USERAUTH'),
                    PageNo: $scope.pageIndex,
                    PageSize: 10,
                    Con_CategoryIds: $scope.categoryId || '',
                    Con_BrandIds: $scope.brandId || '',
                    Con_Price: $scope.priceUp,
                    Con_Discount: $scope.discountUp
                },
                success: function (data) {

                    $scope.noNetwork = false;
                    $scope.noResults = false;

                    if (data.Activity) {
                        $scope.startTime = data.Activity.StartTime.replace('T00:00:00Z', '');
                        $scope.endTime = data.Activity.OverTime.replace('T00:00:00Z', '');
                        $scope.restTime = dateSubtract($scope.endTime);
                    }

                    if (data.List && data.List.length > 0) {
                        $scope.goodsList = sort ? [] : ($scope.goodsList || []);
                        $scope.goodsList = $scope.goodsList.concat(data.List); //拼接数据

                        if ($scope.pageIndex >= data.Total) {
                            $scope.loadMoreAble = false;
                        } else {
                            $scope.loadMoreAble = true;
                            $scope.pageIndex++;
                            $timeout(function () {
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                            }, 0);
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

        $scope.getCategoryList = function () {
            Util.ajaxRequest({ // 分类接口。参数传来Auth, 返回一级产品分类 和二级产品分类列表
                noMask: true,
                url: '$server/InternalPurchase/GetProductCategoryList',
                data: {
                    Auth: DataCachePool.pull('USERAUTH')
                },
                success: function (data) {
                    if (data.List && data.List.length > 0) {
                        $scope.sortPrimary = data.List;
                        $scope.sortPrimarySelected = 'clear';
                        // $scope.sortSecondary = data.List[0].SubCategory;
                    }
                },
                error: function (data) {
                    $scope.categoryLoadFail = true;
                }
            });
        };

        $scope.getBrandList = function () {

            function brandListShow(id) {
                Util.ajaxRequest({ // 品牌接口，参数传来Auth, 返回品牌列表
                    noMask: true,
                    url: '$server/InternalPurchase/GetProductBrandList',
                    data: {
                        Auth: DataCachePool.pull('USERAUTH'),
                        ActivityId: id
                    },
                    success: function (data) {
                        if (data.List && data.List.length > 0) {
                            $scope.brandSelected = 'clear';
                            $scope.brandList = data.List;
                        }
                    },
                    error: function (data) {
                        $scope.brandLoadFail = true;
                    }
                });
            }

            if ($scope.isHeart) {
                brandListShow();
                return;
            }

            Util.ajaxRequest({ // 取活动ID
                noMask: true,
                url: '$server/InternalPurchase/GetCurActivity',
                data: {
                    Auth: DataCachePool.pull('USERAUTH')
                },
                success: function (data) {
                    if (data.Activity) {
                        brandListShow(data.Activity.Id);
                    } else {
                        $scope.brandLoadFail = true;
                    }
                },
                error: function (data) {
                    $scope.brandLoadFail = true;
                }
            });

        };

        $scope.filtersCtrl = function (type) {
            switch (type) {
            case 'sort': //筛选
                $scope.showBrand = false;
                $scope.showSort = $scope.showSort ? false : true;
                $ionicScrollDelegate.$getByHandle('sortPrimary').scrollTo(0, 0);
                break;
            case 'brand': //品牌
                $scope.showSort = false;
                $scope.showBrand = $scope.showBrand ? false : true;
                break;
            case 'price': //价格
                renderData(type);
                break;
            case 'discount': //折扣
                renderData(type);
                break;
            case 'backdrop':
                $scope.showSort = false;
                $scope.showBrand = false;
                break;
            default:
                $ionicScrollDelegate.$getByHandle('listScroll').scrollTo(0, 0, true);
                $scope.isSingle = $scope.isSingle ? false : true;
                $scope.showSort = false;
                $scope.showBrand = false;
            }
        };

        $scope.sortSelect = function (index) {
            if (typeof index === 'number') {
                $scope.sortPrimarySelected = index;
                // $scope.primaryId = $scope.sortPrimary[index].Id;

                var arr = $scope.sortPrimary[index].SubCategory || [];
                if (arr.length > 0) {
                    $scope.sortSecondary = $scope.sortPrimary[index].SubCategory;
                } else {
                    $scope.sortSecondary = [$scope.sortPrimary[index]];
                }

                $ionicScrollDelegate.$getByHandle('sortSecondary').scrollTo(0, 0, true);
            } else {
                if (index === 'primaryClear') {
                    $scope.sortPrimarySelected = 'clear';
                    $scope.sortSecondary = null;
                    $scope.categoryId = '';
                } else {
                    $scope.categoryId = index;
                }
                renderData(true);
            }
        };

        $scope.brandSelect = function (brandId, index) {
            if (brandId === 'clear') {
                $scope.brandSelected = 'clear';
                $scope.brandId = '';
            } else {
                $scope.brandSelected = index;
                $scope.brandId = brandId;
            }

            renderData(true);
        };

        renderData(true); //首屏加载
        $scope.getCategoryList();
        $scope.getBrandList();

        $scope.loadMore = function () { //翻页加载
            renderData(false);
        };

        $scope.toDetail = function (goodsId, innerId) {
            if ($scope.isHeart) {
                $state.go('epbuy.want', {
                    GoodsId: goodsId
                });
            } else {
                $state.go('epbuy.detail', {
                    GoodsId: goodsId,
                    InnerId: innerId
                });
            }

        };

    });
