'use strict';

angular.module('EPBUY')
	.controller('PaymentCtrl', function ($scope, $state, $window, $ionicPopup, Util, DataCachePool) {

		$scope.modeOfPayment = 'alipay';

		$scope.getNewPasswd = function () { //修改密码
			if (!$scope.inputVal.password) {
				Util.msgToast('请输入当前密码');
				return;
			}

			if (!$scope.inputVal.newPassword) {
				Util.msgToast('请输入新密码');
				return;
			}

			Util.ajaxRequest({
				isPopup: true,
				url: '$server/Account/PasswordUpdate',
				data: {
					Auth: DataCachePool.pull('USERAUTH'),
					password: $scope.inputVal.password,
					newpassword: $scope.inputVal.newPassword
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