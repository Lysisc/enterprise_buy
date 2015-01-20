'use strict';

angular.module('EPBUY')
	.controller('PersonInfoCtrl', function ($scope, $state, DataCachePool) {

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
