'use strict';

angular.module('EPBUY')
	.controller('ForgetPasswordCtrl', function ($scope, $state, $timeout, $ionicPopup, Util, DataCachePool) {

		$scope.validationDisabled = false; //验证码不可用
		$scope.validationEnable = true; //验证码可用
		$scope.inputVal = {}; //初始化ng-model
		$scope.inputVal.phoneNumber = DataCachePool.pull('REMEMBER_LOGIN') ? DataCachePool.pull('USERNAME') : null;

		$scope.getVerificationCode = function () { //获取验证码

			Util.ajaxRequest({
				noMask: true,
				url: '$server/Tools/SendCheckCode',
				data: {
					Mobile: $scope.inputVal.phoneNumber // todo...
				},
				success: function (data) {
					var time = 30,
						countdown = function () { //倒计时
							if (time > 0) {
								$scope.validationHtml = '重新发送' + time;
								time--;
								$timeout(countdown, 1000);
							} else {
								$scope.validationHtml = '重新发送' + time;
								$scope.validationEnable = true;
								$scope.validationDisabled = false;
							}
						};

					if (data.ShortMessage) {
						Util.msgToast($scope, data.ShortMessage);
						$scope.validationDisabled = true;
						$scope.validationEnable = false;
						$timeout(countdown, 0);
					} else {
						Util.msgToast($scope, data.msg || '手机号无效');
					}

				}
			});

		};

		$scope.getNewPasswd = function () { //拿新密码

			if (!$scope.inputVal.phoneNumber) {
				Util.msgToast($scope, '请输入用户名');
				return;
			}

			if (!/^1[3|4|5|8][0-9]\d{4,8}$/.test($scope.inputVal.phoneNumber)) {
				Util.msgToast($scope, '用户名格式不合法');
				return;
			}

			if (!$scope.inputVal.validationCode) {
				Util.msgToast($scope, '请输入验证码');
				return;
			}

			if (!$scope.inputVal.newPassword) {
				Util.msgToast($scope, '请输入新密码');
				return;
			}

			if ($scope.inputVal.newPassword.length <= 5) {
				Util.msgToast($scope, '新密码必须大于或等于6位');
				return;
			}

			if (!$scope.inputVal.reenterPassword) {
				Util.msgToast($scope, '请再次输入新密码');
				return;
			}

			if ($scope.inputVal.reenterPassword !== $scope.inputVal.newPassword) {
				Util.msgToast($scope, '两次输入不相符，请重新输入');
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
									$state.go('epbuy.login');
								}
							}]
						});
					} else {
						Util.msgToast($scope, data.msg);
					}
				},
				error: function (data) {
					Util.msgToast($scope, '修改失败，请检查网络');
				}
			});

		};

	});