'use strict';

angular.module('EPBUY')
    .controller('OrderDetailCtrl', function ($scope, $state, $stateParams, Util, DataCachePool) {

        $scope.orderId = $stateParams.OrderId || 0;

        if ($scope.orderId) {
            Util.ajaxRequest({
                url: '$server/Myself/GetOrderDetail',
                data: {
                    Auth: DataCachePool.pull('USERAUTH'),
                    OrderID: $scope.orderId
                },
                success: function (data) {
                    $scope.noNetwork = false;

                    if (data.state === 200) {
                        $scope.data = data;
                        $scope.data.Amount = Math.round((data.OrderAmount - data.Freight) * 100) / 100;
                        $scope.data.Address = data.DeliveredAddress.replace(/,|市辖区/g, '');
                    } else {
                        Util.msgToast(data.msg);
                    }
                },
                error: function () {
                    $scope.noNetwork = true;
                }
            });
        }

        $scope.goOrder = function () {
            $state.go('epbuy.payment', {
                OrderId: $scope.orderId
            });
        };

    });
