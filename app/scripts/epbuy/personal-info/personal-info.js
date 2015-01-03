'use strict';

angular.module('EPBUY')
	.controller('PersonInfoCtrl', function ($scope, $state, DataCachePool) {

		// Util.ajaxRequest({ //请求数据
		// 	url: '$server/Account/QueryEnterpriseByName',
		// 	data: {
		// 		enterpriseCode: $scope.enterpriseCode // todo...
		// 	},
		// 	success: function (data) {

		// 		$scope.phoneNumber = 13122183177;
		// 	}
		// });

		$scope.phoneNumber = DataCachePool.pull('USERNAME');

		$scope.toJump = function (type) {
			switch (type) {
			case 'phone':
				$state.go('epbuy.modify-pp', {
					type: type
				});
				break;
			case 'password':
				$state.go('epbuy.modify-pp', {
					type: type
				});
				break;
			default:
				$state.go('epbuy.modify-pp', {
					type: 'phone'
				});
			}
		};

	});