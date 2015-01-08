'use strict';

angular.module('EPBUY')
	.controller('PaymentCtrl', function ($scope, $state, $stateParams, Util, DataCachePool) {

		$scope.modeOfPayment = 'alipay';
		$scope.orderId = $stateParams.OrderId || 0;

		Util.ajaxRequest({
			url: '$server/Order/GetPayOrderDetail',
			data: {
				Auth: DataCachePool.pull('USERAUTH'),
				Id: $scope.orderId
			},
			success: function (data) {
				if (data.state === 200) {
					$scope.data = data;
				} else {
					Util.msgToast(data.msg);
				}
			}
		});

		$scope.submitPayment = function (mode) {
			if (!mode) {
				Util.msgToast('请选择支付方式');
				return;
			} else if (mode === 'alipay') {
				window.location.href = 'http://www.51mart.com.cn/Service/Pay/AliPayPage/Default.aspx?Id=' + $scope.orderId + '&Auth=' + DataCachePool.pull('USERAUTH');
			} else if (mode === 'integral') {
				window.location.href = 'http://www.51mart.com.cn/Service/api/Order/IntegralPay?Id=' + $scope.orderId + '&Auth=' + DataCachePool.pull('USERAUTH');
			}
		};

	});