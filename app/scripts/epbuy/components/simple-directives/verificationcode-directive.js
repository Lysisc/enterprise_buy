'use strict';

angular.module('EPBUY')

// 获取验证码
.directive('getVerificationcode', function ($timeout, $rootScope, Util, DataCachePool) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {

            scope.validationDisabled = false; //验证码不可用
            scope.validationEnable = true; //验证码可用

            element.on('click', function () {

                if (!scope.inputVal.phoneNumber) {
                    Util.msgToast('请输入手机号码');
                    return;
                }

                if (!/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(scope.inputVal.phoneNumber)) {
                    Util.msgToast('手机号码格式不合法');
                    return;
                }

                if (attr.change && scope.inputVal.phoneNumber === DataCachePool.pull('USERNAME')) {
                    Util.msgToast('请输入新的手机号码');
                    return;
                }

                Util.ajaxRequest({
                    noMask: true,
                    url: '$server/Tools/SendCheckCode',
                    data: {
                        Mobile: scope.inputVal.phoneNumber // todo...
                    },
                    success: function (data) {
                        var time = 30,
                            countdown = function () { //倒计时
                                if (time > 0) {
                                    scope.validationHtml = '重新发送' + time;
                                    time--;
                                    $timeout(countdown, 1000);
                                } else {
                                    scope.validationHtml = '重新发送' + time;
                                    scope.validationEnable = true;
                                    scope.validationDisabled = false;
                                }
                            };

                        if (data.ShortMessage) {
                            Util.msgToast(data.ShortMessage);
                            scope.validationDisabled = true;
                            scope.validationEnable = false;
                            $timeout(countdown, 0);
                        } else {
                            Util.msgToast(data.msg || '手机号无效');
                        }

                    }
                });


            });

        }
    };
});
