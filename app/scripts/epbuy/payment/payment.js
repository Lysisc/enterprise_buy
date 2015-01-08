'use strict';

angular.module('EPBUY')
	.controller('PaymentCtrl', function ($scope, $state, $stateParams, $window, $ionicPopup, Util, DataCachePool) {

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

		$scope.getNewPasswd = function () {
			if (!$scope.modeOfPayment) {
				Util.msgToast('请输入当前密码');
				return;
			}

			Util.ajaxRequest({
				isPopup: true,
				url: '$server/Order/GetPayOrderDetail',
				data: {
					Auth: DataCachePool.pull('USERAUTH'),
					Id: $scope.inputVal.password
				},
				success: function (data) {
					if (data.state === 200) {
						$ionicPopup.alert({
							template: data.msg,
							buttons: [{
								text: '知道了',
								type: 'button-positive',
								onTap: function () {
									$window.history.back();
								}
							}]
						});
					} else {
						Util.msgToast('修改失败，请重试');
					}
				},
				error: function (data) {
					Util.msgToast('修改失败，请检查网络');
				}
			});

		};

	});