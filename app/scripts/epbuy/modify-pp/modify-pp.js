'use strict';

angular.module('EPBUY')
	.controller('ModifyPpCtrl', function ($scope, $state, $window, $stateParams, $ionicPopup, $timeout, Util, DataCachePool) {

		$scope.modifiedType = $stateParams.type || 'phone';
		$scope.inputVal = {}; //初始化ng-model

		$scope.modifiedPhone = function () { //修改手机号
			if (!$scope.inputVal.phoneNumber) {
				Util.msgToast('请输入手机号码');
				return;
			}

			if (!/^1[3|4|5|7|8][0-9]\d{4,8}$/.test($scope.inputVal.phoneNumber)) {
				Util.msgToast('手机号码格式不合法');
				return;
			}

			if ($scope.inputVal.phoneNumber === DataCachePool.pull('USERNAME')) {
				Util.msgToast('请输入新的手机号码');
				return;
			}

			if (!$scope.inputVal.validationCode) {
				Util.msgToast('请输入验证码');
				return;
			}

			Util.ajaxRequest({
				isPopup: true,
				url: '$server/Myself/PhoneUpdate',
				data: {
					Auth: DataCachePool.pull('USERAUTH'),
					LoginName: $scope.inputVal.phoneNumber,
					CheckCode: $scope.inputVal.validationCode
				},
				success: function (data) {
					if (data.state === 200) {
						DataCachePool.push('USERNAME', $scope.inputVal.phoneNumber);
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

		$scope.getNewPasswd = function () { //修改密码
			if (!$scope.inputVal.password) {
				Util.msgToast('请输入当前密码');
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

			if ($scope.inputVal.password === $scope.inputVal.newPassword) {
				Util.msgToast('新密码和当前密码不能相同');
				return;
			}

			Util.ajaxRequest({
				isPopup: true,
				url: '$server/Myself/PasswordUpdate',
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
