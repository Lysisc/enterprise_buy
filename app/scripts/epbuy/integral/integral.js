'use strict';

angular.module('EPBUY')
	.controller('IntegralCtrl', function ($scope, $state, Util) {

		Util.ajaxRequest({
			url: '$local/GetHomeRestaurantBannerInfo.json',
			data: {
				enterpriseCode: $scope.enterpriseCode // todo...
			},
			success: function (data) {
				$scope.noNetwork = false;

				$scope.integralList = data.commentList;
			},
			error: function (data) {
				$scope.noNetwork = true;
			}
		});

	});