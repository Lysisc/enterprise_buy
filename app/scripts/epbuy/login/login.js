'use strict';

angular.module('EPBUY')
	.controller('LoginCtrl', function ($scope, $state, Util, DataCachePool) {

		Util.ajaxRequest({
			noMask: true,
			url: '$api/Account/CheckLogin',
			data: {
				Auth: DataCachePool.pull('USERAUTH')
			},
			success: function (data) {
				if (data && data.IsLogin) {
					$state.go('epbuy.home');
				} else {
					$state.go('epbuy.login');
				}
			},
			error: function (data) {}
		});

		$scope.inputVal = {}; //初始化ng-model
		$scope.inputVal.phoneNumber = DataCachePool.pull('USERNAME');
		$scope.inputVal.checked = $scope.inputVal.phoneNumber ? true : false;

		$scope.goRegistered = function () {
			$state.go('epbuy.registered');
		};

		$scope.getLogin = function () { //首页跳转

			if (!$scope.inputVal.phoneNumber) {
				Util.msgToast($scope, '请输入用户名');
				return;
			}

			if (!/^1[3|4|5|8][0-9]\d{4,8}$/.test($scope.inputVal.phoneNumber)) {
				Util.msgToast($scope, '用户名格式不合法');
				return;
			}

			if (!$scope.inputVal.password) {
				Util.msgToast($scope, '请输入密码');
				return;
			}

			Util.ajaxRequest({
				noMask: true,
				url: '$api/Account/Login',
				data: {
					LoginName: $scope.inputVal.phoneNumber,
					Password: $scope.inputVal.password
				},
				success: function (data) {
					if (data && data.UserEntity) {

						if ($scope.inputVal.checked) { //如果选择记住我，则存入用户名
							DataCachePool.push('USERNAME', $scope.inputVal.phoneNumber);
						} else {
							DataCachePool.remove('USERNAME');
						}

						DataCachePool.push('USERAUTH', data.UserEntity.Auth, 2 / 24); //存入用户Auth，并设置过期时间
						$state.go('epbuy.home');
					} else {
						Util.msgToast($scope, data.msg || '用户名或密码错误');
					}
				},
				error: function (data) {
					Util.msgToast($scope, '登录失败请重试');
				}
			});

		};

	});