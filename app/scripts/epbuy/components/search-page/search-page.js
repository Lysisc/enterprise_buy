'use strict';

angular.module('EPBUY')

// 搜索页
.directive('searchPage', function ($timeout, $state, $ionicScrollDelegate, Util) {
    return {
        restrict: 'E',
        templateUrl: 'scripts/epbuy/components/search-page/search-page.html',
        controller: function ($scope) {

            $timeout(function () {
                $scope.showGlass = true;
            }, 300);

            $scope.searchObj = {};

            $scope.showSearch = function () {
                var input = document.getElementById('searchInput').focus();
                $scope.searchObj.searchVal = null;
                $scope.showSearchPage = true;
                $scope.searchResultList = true;
            };

            $scope.chooseItemSearch = function (goodsId) { // 搜索结果跳转
                switch ($scope.searchType) {
                case 'detail':
                    $state.go('epbuy.detail', {
                        GoodsId: goodsId
                    });
                    break;
                case 'want':
                    $state.go('epbuy.want', {
                        GoodsId: goodsId
                    });
                    break;
                default:
                    console.log('searchType is null');
                }
            };

            var searchTimer = null,
                searchAjaxUrl = '';

            switch ($scope.searchType) {
            case 'detail':
                searchAjaxUrl = '$local/GetHomeRestaurantBannerInfo.json';
                break;
            case 'want':
                searchAjaxUrl = '$local/GetHomeRestaurantBannerInfo.json';
                break;
            }

            $scope.searchChange = function () { //监听搜索输入框的值

                if (!searchAjaxUrl) {
                    console.log('未定义接口类型');
                    return false;
                }

                $ionicScrollDelegate.$getByHandle('searchScroll').scrollTo(0, 0, true);

                if ($scope.searchObj.searchVal) {

                    $timeout.cancel(searchTimer);

                    searchTimer = $timeout(function () {
                        Util.ajaxRequest({
                            noMask: true,
                            url: searchAjaxUrl,
                            data: {
                                enterpriseCode: $scope.enterpriseCode // todo...
                            },
                            success: function (data) {
                                if (data.commentList1 && data.commentList.length > 0) {
                                    $scope.searchResultList = data.commentList; //取数据 todo...
                                } else {
                                    $scope.searchResultList = false;
                                }
                            },
                            error: function (data) {
                                $scope.searchResultList = false;
                            }
                        });
                    }, 300);

                } else {
                    $timeout.cancel(searchTimer);
                    $scope.searchResultList = true;
                }
            };
        }
    };
});