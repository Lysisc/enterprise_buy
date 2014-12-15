'use strict';

angular.module('EPBUY')

// 回退逻辑判断
.directive('epbuyJump', function ($state) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {

            var pageName = attr.epbuyJump;

            element.on('click', function () {
                switch (pageName) {
                case 'login':
                    $state.go('epbuy.login');
                    break;
                case 'registered':
                    $state.go('epbuy.registered');
                    break;
                case 'home':
                    $state.go('epbuy.home');
                    break;
                case 'list':
                    $state.go('epbuy.list');
                    break;
                case 'detail':
                    $state.go('epbuy.detail');
                    break;
                }
            });
        }
    };
});