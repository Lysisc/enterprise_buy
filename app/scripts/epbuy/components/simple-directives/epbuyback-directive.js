'use strict';

angular.module('EPBUY')

// 回退逻辑判断
.directive('epbuyBack', function ($window, $state, $location) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            element.on('click', function () {
                if ($state.is('epbuy.home')) {
                    $state.go('epbuy.guide');
                } else { // 默认执行浏览器后退
                    $window.history.back();
                }
            });
        }
    };
});