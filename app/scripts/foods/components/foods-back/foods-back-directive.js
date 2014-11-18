'use strict';

angular.module('EPBUY')
    .directive('foodsBack', function ($window, $state, ENV, $location) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element.on('click', function () {
                    if (ENV.isHybrid && $state.is('foods.homefront')) {
                        // Hybrid 环境下的大首页后退功能
                        // window.CtripUtil.app_open_url('ctrip://wireless', 1);
                        window.CtripUtil.app_back_to_last_page('', false);
                    } else if (ENV.isHybrid && $state.is('foods.home')) {
                        // Hybrid 环境下的首页后退功能
                        window.CtripUtil.app_back_to_last_page('', false);
                        // app.callBridge('CtripUtil', 'app_back_to_last_page', params);
                    } else if (!ENV.isHybrid && $state.is('foods.homefront')) {
                        window.location.href = 'http://m.ctrip.com';
                    } else if (!ENV.isHybrid && $state.is('foods.home')) {
                        window.location.href = '#/foods/homefornt';
                    } else if ($state.is('foods.findfoods')) {
                        window.location.href = '#/foods/home';
                    } else if ($state.is('foods.restaurant') && $location.search().jumpindex === '1') {
                        window.location.href = '#/foods/home';
                    } else if ($state.is('foods.checkout')) {
                        var isJumped = $location.search().jumpindex === '1' ? '?jumpindex=1' : '';
                        window.location.href = '#/foods/rest/' + $location.search().restid + isJumped;
                    } else {
                        // 默认执行浏览器后退
                        $window.history.back();
                    }

                });
            }
        };
    });
