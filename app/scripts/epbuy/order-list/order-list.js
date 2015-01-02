'use strict';

angular.module('EPBUY')
    .controller('OrderListCtrl', function ($scope, $state, $timeout, $ionicLoading, $location, Util) {

        if ($location.search() && $location.search().type) {
            var type = $location.search().type;
            switch (type) {
            case 'pay':
                $scope.orderListTitle = '代付款';
                break;
            case 'rec':
                $scope.orderListTitle = '代收货';
                break;
            default:
                $scope.orderListTitle = '全部';
            }
        } else {
            $scope.orderListTitle = '全部';
        }

        $scope.pageIndex = 1;
        $scope.orderList = [];
        $ionicLoading.show({
            template: '<span class="ion-load-d"></span>'
        });

        Util.backDrop.retain();

        $scope.loadMore = function () { //翻页加载
            Util.ajaxRequest({
                noMask: true,
                url: '$local/GetHomeRestaurantBannerInfo.json',
                data: {
                    enterpriseCode: 'abs' // todo...
                },
                success: function (data) {

                    $scope.noNetwork = false;

                    if (data.commentList && data.commentList.length > 0) {

                        $scope.orderList = $scope.orderList.concat(data.commentList); //拼接数据
                        $scope.pageIndex++;

                        $timeout(function () {
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        }, 300);

                    } else {
                        if ($scope.orderList.length === 0) {
                            $scope.noResults = true;
                        } else {
                            $scope.noMordResults = true;
                        }
                    }
                },
                error: function (data) {
                    $scope.noNetwork = true;
                }
            });
        };

        $scope.toOrderDetail = function (orderId) {
            if (!orderId) {
                return;
            }

            $state.go('epbuy.order-detail', {
                OrderId: orderId
            });
        };

    });