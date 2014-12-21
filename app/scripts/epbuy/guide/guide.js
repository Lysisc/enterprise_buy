'use strict';

angular.module('EPBUY')
    .controller('GuideCtrl', function ($scope, $timeout, $state, Util, DataCachePool) {

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

        $scope.goLogin = function () { //判断跳登陆页还是首页

            DataCachePool.push('SHOWED_GUIDE', 1);

            Util.ajaxRequest({
                noMask: true,
                url: '$api/Account/CheckLogin',
                data: {
                    Auth: DataCachePool.pull('USERAUTH')
                },
                success: function (data) {
                    if (data && data.IsLogin) {
                        $state.go('epbuy.home');
                    } else {
                        $state.go('epbuy.login');
                    }
                },
                error: function (data) {
                    $state.go('epbuy.login');
                }
            });

        };

    });