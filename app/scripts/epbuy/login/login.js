'use strict';

angular.module('EPBUY')
    .controller('LoginCtrl', function ($scope, $state, Util) {

        Util.focusInput($scope);

        $scope.goLogin = function () { //首页跳转

            $state.go('epbuy.login');
            localStorage.setItem('EPBUY_SHOW_GUIDE', 0);

        };

    });