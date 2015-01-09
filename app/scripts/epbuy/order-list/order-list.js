'use strict';

angular.module('EPBUY')
    .controller('OrderListCtrl', function ($scope, $state, $ionicLoading, $location, Util, DataCachePool) {

        var orderStatus = '';
        if ($location.search() && $location.search().type) {
            var type = $location.search().type;
            switch (type) {
            case 'pay':
                orderStatus = '未支付';
                $scope.orderListTitle = '代付款';
                break;
            case 'rec':
                orderStatus = '已发货';
                $scope.orderListTitle = '代收货';
                break;
            default:
                orderStatus = '全部';
                $scope.orderListTitle = '全部';
            }
        } else {
            orderStatus = '全部';
            $scope.orderListTitle = '全部';
        }

        $scope.pageIndex = 1;
        $scope.orderList = [];
        $ionicLoading.show({
            template: '<span class="ion-load-d"></span>'
        });

        Util.backDrop.retain();

        function renderData() {
            Util.ajaxRequest({
                noMask: true,
                url: '$server/Myself/GetOrderListByAuth',
                data: {
                    Auth: DataCachePool.pull('USERAUTH'),
                    OrderStatus: orderStatus,
                    pageIndex: $scope.pageIndex,
                    pageSize: 10
                },
                success: function (data) {

                    $scope.noNetwork = false;

                    if (data.orderList && data.orderList.length > 0) {

                        $scope.orderList = $scope.orderList.concat(data.orderList);

                        for (var i = 0; i < $scope.orderList.length; i++) {
                            $scope.orderList[i].OrderDate = $scope.orderList[i].OrderDate.replace(/:{1}\w{2}\.{1}.+$/g, '').replace('T', ' ');
                        }

                        if ($scope.pageIndex * 10 >= data.ordercount) {
                            $scope.loadMoreAble = false;
                        } else {
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            $scope.pageIndex++;
                            $scope.loadMoreAble = true;
                        }

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
        }

        renderData();

        $scope.loadMore = function () { //翻页加载
            renderData();
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
