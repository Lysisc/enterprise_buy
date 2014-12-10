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
            $scope.showSearchPage = false;

            $scope.showSearch = function () {
                // var input = document.getElementById('searchInput').focus();
                $scope.searchObj.searchVal = null;
                $scope.showSearchPage = true;
                $scope.searchResultList = true;
            };

            $scope.hideSearch = function () {
                $scope.searchResultList = false;
                $scope.showSearchPage = false;
            };

            $scope.chooseItemSearch = function (itemId) { // 搜索结果跳转
                console.log(itemId);

                switch ($scope.searchType) {
                case 'detail':
                    $state.go('epbuy.login');
                    break;
                case 'want':
                    $state.go('epbuy.login');
                    break;
                default:
                    console.log('searchType is null');
                }
            };

            var searchTimer = null,
                searchAjaxUrl = '';

            switch ($scope.searchType) {
            case 'detail':
                searchAjaxUrl = 'GetHomeRestaurantBannerInfo';
                break;
            case 'want':
                searchAjaxUrl = 'GetHomeRestaurantBannerInfo';
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
                            url: searchAjaxUrl,
                            effect: 'false',
                            data: {
                                enterpriseCode: $scope.enterpriseCode // todo...
                            },
                            success: function (data) {
                                if (data.commentList && data.commentList.length > 0) {
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
