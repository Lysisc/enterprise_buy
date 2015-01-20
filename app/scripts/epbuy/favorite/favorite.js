'use strict';

angular.module('EPBUY')
    .controller('FavoriteCtrl', function ($scope, $state, $timeout, Util, DataCachePool) {

        $scope.pageIndex = 1;
        $scope.goodsList = [];

        $scope.goodsList = DataCachePool.pull('COLLECTION_GOODS') || [];
        if ($scope.goodsList.length === 0) {
            $scope.noResults = true;
        }

        // $scope.loadMore = function () { //翻页加载
        //     Util.ajaxRequest({
        //         noMask: true,
        //         url: '$local/GetHomeRestaurantBannerInfo.json',
        //         data: {
        //             enterpriseCode: 'abs' // todo...
        //         },
        //         success: function (data) {

        //             $scope.noNetwork = false;

        //             if (data.commentList && data.commentList.length > 0) {

        //                 $scope.goodsList = $scope.goodsList.concat(data.commentList); //拼接数据
        //                 $scope.pageIndex++;

        //                 $timeout(function () {
        //                     $scope.$broadcast('scroll.infiniteScrollComplete');
        //                 }, 300);

        //             } else {
        //                 if ($scope.goodsList.length === 0) {
        //                     $scope.noResults = true;
        //                 } else {
        //                     $scope.noMordResults = true;
        //                 }
        //             }
        //         },
        //         error: function (data) {
        //             $scope.noNetwork = true;
        //         }
        //     });
        // };

        var hasChosenList = ''; // 多选待删除的数组

        $scope.hasChosenItem = function (e, index) {
            var el = angular.element(e.target);
            if (el.attr('checked') === 'checked') {
                hasChosenList += index;
            } else {
                hasChosenList = hasChosenList.replace(index, '');
            }
        };

        $scope.deleteGoods = function (str) { // 删除数组

            if (!str) {
                return false;
            }

            var tempArr = [],
                deleteArr = [];

            for (var i = 0; i < $scope.goodsList.length; i++) {
                var isExist = new RegExp(i).test(str);
                if (isExist) {
                    $scope.goodsList[i].removing = true;
                    deleteArr.push($scope.goodsList[i]);
                } else {
                    if (!$scope.goodsList[i].removing) {
                        tempArr.push($scope.goodsList[i]);
                    }
                }
            }

            $timeout(function () {

                if (tempArr.length > 0) {
                    DataCachePool.push('COLLECTION_GOODS', tempArr);
                } else {
                    DataCachePool.remove('COLLECTION_GOODS');
                    $scope.noResults = true;
                    $scope.goodsList = [];
                }

                for (var i = 0; i < deleteArr.length; i++) { //移除隐藏元素
                    deleteArr[i].removed = true;
                }

            }, 300);
        };

        $scope.deleteMoreGoods = function (e) {
            var el = angular.element(e.target);

            if (el.text() === '编辑') {
                el.text('删除');
                $scope.moreGoodsChoos = true;
                hasChosenList = '';

            } else {
                el.text('编辑');
                $scope.moreGoodsChoos = false;
                $timeout(function () {
                    $scope.deleteGoods(hasChosenList);
                }, 300);
            }
        };

        $scope.toDetail = function (goodsId, innerId) {
            $state.go('epbuy.detail', {
                GoodsId: goodsId,
                InnerId: innerId
            });
        };

    });
