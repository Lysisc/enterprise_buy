'use strict';

angular.module('EPBUY')
	.directive('noNetwork', function ($state, $stateParams) {
		return {
			restrict: 'E',
			templateUrl: 'scripts/epbuy/components/no-network/no-network.html',
			controller: function ($scope) {
				
				$scope.refreshPage = function () {

					var current = $state.current;
					var params = angular.copy($stateParams);
					$state.transitionTo(current, params, {
						reload: true,
						inherit: true,
						notify: true
					});

				};

			}
		};
	});