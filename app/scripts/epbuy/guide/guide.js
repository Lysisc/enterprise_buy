'use strict';

angular.module('EPBUY')
    .controller('GuideCtrl', function ($scope, $timeout, $state, ENV, Util) {

        var pager = null;

        $scope.$on('$viewContentLoaded', function () { //页面初始化处理

            $timeout(function () {

                pager = angular.element(document.querySelector('.slider-pager'));

                angular.element(pager[0].firstElementChild).html('1');
                angular.element(pager[0].lastElementChild).remove();

            });

        });

        $scope.slideHasChanged = function (index) { //引导页滑动时触发该事件

            pager.find('span').html('<i class="icon ion-record"></i>');
            pager.find('span').eq(index).html(index + 1);

            pager.css('display', index === 3 ? 'none' : 'block');

        };

        $scope.goLogin = function () { //首页跳转

            $state.go('epbuy.login');
            localStorage.setItem('EPBUY_SHOW_GUIDE', 0);

        };

    });
