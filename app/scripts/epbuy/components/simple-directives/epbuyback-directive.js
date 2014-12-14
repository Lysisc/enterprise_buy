'use strict';

angular.module('EPBUY')

// 回退逻辑判断
.directive('epbuyBack', function ($window, $state, $location) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            element.on('click', function () {

                if ($state.is('epbuy.home')) {

                    window.location.href = '#/epbuy/guide';

                } else if ($state.is('epbuy.findepbuy')) {

                    window.location.href = '#/epbuy/home';

                } else if ($state.is('epbuy.restaurant') && $location.search().jumpindex === '1') {

                    window.location.href = '#/epbuy/home';

                } else if ($state.is('epbuy.checkout')) {

                    var isJumped = $location.search().jumpindex === '1' ? '?jumpindex=1' : '';
                    window.location.href = '#/epbuy/rest/' + $location.search().restid + isJumped;

                } else { // 默认执行浏览器后退
                    $window.history.back();
                }

            });
        }
    };
});
