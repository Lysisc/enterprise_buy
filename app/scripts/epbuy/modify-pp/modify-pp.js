'use strict';

angular.module('EPBUY')
	.controller('ModifyPpCtrl', function ($scope, $state, $window, $stateParams, $timeout, Util, DataCachePool) {

		$scope.modifiedType = $stateParams.type || 'phone';
		$scope.validationDisabled = false; //验证码不可用
		$scope.validationEnable = true; //验证码可用
		$scope.inputVal = {}; //初始化ng-model

		$scope.getVerificationCode = function () { //获取验证码
			if (!$scope.inputVal.newPhoneNumber) {
				Util.msgToast($scope, '请输入手机号码');
				return;
			}

			if ($scope.inputVal.newPhoneNumber === DataCachePool.pull('USERNAME')) {
				Util.msgToast($scope, '请输入新的手机号码');
				return;
			}

			Util.ajaxRequest({
				noMask: true,
				url: '$server/Tools/SendCheckCode',
				data: {
					Mobile: $scope.inputVal.newPhoneNumber // todo...
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

					if (data && data.ShortMessage) {
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

		$scope.modifiedPhone = function () { //修改手机号
			if (!$scope.inputVal.newPhoneNumber) {
				Util.msgToast($scope, '请输入手机号码');
				return;
			}

			if (!/^1[3|4|5|8][0-9]\d{4,8}$/.test($scope.inputVal.newPhoneNumber)) {
				Util.msgToast($scope, '手机号码格式不合法');
				return;
			}

			if ($scope.inputVal.newPhoneNumber === DataCachePool.pull('USERNAME')) {
				Util.msgToast($scope, '请输入新的手机号码');
				return;
			}

			Util.ajaxRequest({
				isPopup: true,
				url: '$server/Account/PasswordForgotModify',
				data: {
					Auth: DataCachePool.pull('USERAUTH'),
					LoginName: $scope.inputVal.phoneNumber,
					CheckCode: $scope.inputVal.validationCode
				},
				success: function (data) {
					if (data && data.state === 200) {
						Util.msgToast($scope, data.msg);
						$timeout(function () {
							DataCachePool.push('USERNAME', $scope.inputVal.phoneNumber);
							$window.history.back();
						}, 2000);
					} else {
						Util.msgToast($scope, '修改失败，请重试');
					}
				},
				error: function (data) {
					Util.msgToast($scope, '修改失败，请检查网络');
				}
			});

		};

		$scope.getNewPasswd = function () { //修改密码
			if (!$scope.inputVal.password) {
				Util.msgToast($scope, '请输入当前密码');
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

			if ($scope.inputVal.password === $scope.inputVal.newPassword) {
				Util.msgToast($scope, '新密码和当前密码不能相同');
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
					if (data && data.state === 200) {
						Util.msgToast($scope, data.msg);
						$timeout(function () {
							$window.history.back();
						}, 2000);
					} else {
						Util.msgToast($scope, '修改失败，请重试');
					}
				},
				error: function (data) {
					Util.msgToast($scope, '修改失败，请检查网络');
				}
			});

		};

	});