'use strict';

angular.module('EPBUY')
	.controller('LoginCtrl', function ($scope, $state, Util, DataCachePool) {

		Util.ajaxRequest({
			noMask: true,
			url: '$server/Account/CheckLogin',
			data: {
				Auth: DataCachePool.pull('USERAUTH')
			},
			success: function (data) {
				if (data && data.IsLogin) {
					$state.go('epbuy.home');
				}
			}
		});

		$scope.inputVal = {}; //初始化ng-model
		$scope.inputVal.checked = DataCachePool.pull('REMEMBER_LOGIN') ? true : false;
		$scope.inputVal.phoneNumber = $scope.inputVal.checked ? DataCachePool.pull('USERNAME') : null;

		$scope.toJump = function (type) {
			switch (type) {
			case 'registered':
				$state.go('epbuy.registered');
				break;
			case 'forget-password':
				$state.go('epbuy.forget-password');
				break;
			}
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
				url: '$server/Account/Login',
				data: {
					LoginName: $scope.inputVal.phoneNumber,
					Password: $scope.inputVal.password
				},
				success: function (data) {
					if (data && data.UserEntity) {

						if ($scope.inputVal.checked) { //记住我
							DataCachePool.push('REMEMBER_LOGIN', 1);
						} else {
							DataCachePool.remove('REMEMBER_LOGIN');
						}

						DataCachePool.push('USERNAME', $scope.inputVal.phoneNumber);
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