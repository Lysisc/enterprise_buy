'use strict';

angular.module('EPBUY')
	.controller('PersonCtrl', function ($scope, $state, $location, $ionicActionSheet, $ionicPopup, Util, DataCachePool) {

		Util.ajaxRequest({
			url: '$local/GetHomeRestaurantBannerInfo.json',
			data: {
				enterpriseCode: $scope.enterpriseCode // todo...
			},
			success: function (data) {

				// $scope.phoneNumber = 13122183177;
			}
		});

		$scope.phoneNumber = DataCachePool.pull('USERNAME');

		$scope.toJump = function (type) {
			switch (type) {
			case 'personal-info':
				$state.go('epbuy.personal-info');
				break;
			case 'order-list':
				$state.go('epbuy.order-list');
				break;
			case 'address':
				$state.go('epbuy.address');
				break;
			}
		};

		$scope.callPhone = function (phone) {
			$ionicActionSheet.show({
				buttons: [{
					text: phone
				}],
				titleText: '<a>拨打电话</a>',
				buttonClicked: function (index) {
					window.location.href = 'tel:' + phone;
				}
			});
		};

		$scope.aboutUs = function () {
			$ionicPopup.alert({
				template: '<h4>关于我们</h4><ion-scroll>我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容</ion-scroll>',
				buttons: [{
					text: '朕知道了',
					type: 'button-positive'
				}]
			});
		};

		$scope.goLogout = function () {
			$ionicPopup.confirm({
				template: '确认登出？',
				cancelText: '取消',
				okText: '确定'
			}).then(function (res) {
				if (res) {

					Util.ajaxRequest({
						noMask: true,
						url: '$server/Account/Logout',
						data: {
							Auth: DataCachePool.pull('USERAUTH')
						},
						success: function (data) {
							DataCachePool.remove('USERAUTH');
							$state.go('epbuy.login');
						},
						error: function (data) {
							DataCachePool.remove('USERAUTH');
							$state.go('epbuy.login');
						}
					});

				}
			});
		};

	});