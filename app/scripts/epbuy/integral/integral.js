'use strict';

angular.module('EPBUY')
	.controller('IntegralCtrl', function ($scope, $state, Util, DataCachePool) {

		$scope.pageIndex = 1; //初始化第一页

		Util.ajaxRequest({
			url: '$server/Myself/GetIntegralListByAuth',
			data: {
				Auth: DataCachePool.pull('USERAUTH'),
				pagesize: 10,
				pageindex: $scope.pageIndex
			},
			success: function (data) {
				$scope.noNetwork = false;

				if (data) {
					$scope.data = data;
					$scope.pageIndex++;
				}
			},
			error: function (data) {
				$scope.noNetwork = true;
			}
		});

	});