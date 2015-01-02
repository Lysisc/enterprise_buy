'use strict';

angular.module('EPBUY')
	.controller('ForgetPasswordCtrl', function ($scope, $state, $window, $timeout, $ionicPopup, Util, DataCachePool) {

		$scope.inputVal = {}; //初始化ng-model
		$scope.inputVal.phoneNumber = DataCachePool.pull('REMEMBER_LOGIN') ? DataCachePool.pull('USERNAME') : null;

		$scope.getNewPasswd = function () { //拿新密码

			if (!$scope.inputVal.phoneNumber) {
				Util.msgToast('请输入用户名');
				return;
			}

			if (!/^1[3|4|5|8][0-9]\d{4,8}$/.test($scope.inputVal.phoneNumber)) {
				Util.msgToast('用户名格式不合法');
				return;
			}

			if (!$scope.inputVal.validationCode) {
				Util.msgToast('请输入验证码');
				return;
			}

			if (!$scope.inputVal.newPassword) {
				Util.msgToast('请输入新密码');
				return;
			}

			if ($scope.inputVal.newPassword.length <= 5) {
				Util.msgToast('新密码必须大于或等于6位');
				return;
			}

			if (!$scope.inputVal.reenterPassword) {
				Util.msgToast('请再次输入新密码');
				return;
			}

			if ($scope.inputVal.reenterPassword !== $scope.inputVal.newPassword) {
				Util.msgToast('两次输入不相符，请重新输入');
				return;
			}

			Util.ajaxRequest({
				isPopup: true,
				url: '$server/Account/PasswordForgotModify',
				data: {
					LoginName: $scope.inputVal.phoneNumber,
					CheckCode: $scope.inputVal.validationCode,
					newpassword: $scope.inputVal.newPassword
				},
				success: function (data) {
					if (data.state === 200) {
						$ionicPopup.alert({
							template: '密码更新成功',
							buttons: [{
								text: '去登录',
								type: 'button-positive',
								onTap: function () {
									$window.history.back();
								}
							}]
						});
					} else {
						Util.msgToast(data.msg);
					}
				},
				error: function (data) {
					Util.msgToast('修改失败，请检查网络');
				}
			});

		};

	});