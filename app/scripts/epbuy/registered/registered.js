'use strict';

angular.module('EPBUY')
    .controller('RegisteredCtrl', function ($cacheFactory, $scope, $state, $ionicPopup, $timeout, Util, DataCachePool) {

        $scope.stepInit = true; //step1 view
        $scope.stepOneDisabled = true; //step1 submit
        $scope.stepOnePass = false; //step2 view
        $scope.stepTwoDisabled = true; //step2 submit
        $scope.validationDisabled = false; //验证码不可用
        $scope.validationEnable = true; //验证码可用
        $scope.inputVal = {}; //ng-model变量容器

        $scope.showSearch = function () {
            $scope.searching = true;
            $scope.searchResultList = true;
        };

        $scope.hideSearch = function () {
            $scope.inputVal.searchVal = null;
            $scope.searchResultList = false;
            $scope.searching = false;
        };

        $scope.chooseItemSearch = function (code) { //选择企业
            // angular.element(document.querySelectorAll('.search-item')).removeClass('cur');
            // angular.element(e.target).addClass('cur');
            $scope.inputVal.enterpriseCode = code;
            $scope.inputVal.searchVal = null;
            $scope.stepOneDisabled = false;
            $scope.searching = false;
        };

        var searchTimer = null;
        $scope.searchChange = function () { //监听搜索输入框的值

            if ($scope.inputVal.searchVal) {

                $timeout.cancel(searchTimer);

                searchTimer = $timeout(function () {
                    Util.ajaxRequest({
                        noMask: true,
                        url: '$server/Account/QueryEnterpriseByName',
                        data: {
                            name: $scope.inputVal.searchVal // todo...
                        },
                        success: function (data) {
                            if (data.enterpriselist && data.enterpriselist.length > 0) {
                                $scope.searchResultList = data.enterpriselist;
                            } else {
                                $scope.searchResultList = false;
                            }
                        },
                        error: function (data) {
                            console.log('验证码接口不可用');
                            $scope.searchResultList = false;
                        }
                    });
                }, 300);

            } else {
                $timeout.cancel(searchTimer);
                $scope.searchResultList = true;
            }
        };

        $scope.inputChange = function () { //监听企业码输入框的值
            if ($scope.inputVal.enterpriseCode) {
                $scope.stepOneDisabled = false;
            } else {
                $scope.stepOneDisabled = true;
            }
        };

        $scope.goStepTwo = function () { //去第二步

            Util.ajaxRequest({
                isPopup: true,
                url: '$server/Account/EnterpriseCheck',
                data: {
                    Code: $scope.inputVal.enterpriseCode
                },
                success: function (data) {
                    if (data.state === 999) {
                        var alertPopup = $ionicPopup.alert({
                            template: '抱歉，企业码不存在',
                            buttons: [{
                                text: '知道了'
                            }]
                        });
                        // alertPopup.then(function (res) {
                        //     console.log(res);
                        // });
                    }

                    if (data.state === 200) {
                        $scope.stepInit = false;
                        $scope.stepOnePass = true;
                    }

                },
                error: function (data) {}
            });

        };

        $scope.getVerificationCode = function () { //获取验证码

            Util.ajaxRequest({
                noMask: true,
                url: '$server/Tools/SendCheckCode',
                data: {
                    Mobile: $scope.inputVal.phoneNumber // todo...
                },
                success: function (data) {
                    var time = 30,
                        countdown = function () { //倒计时
                            if (time > 0) {
                                $scope.validationHtml = '重新发送' + time;
                                time--;
                                $timeout(countdown, 1000);
                            } else {
                                $scope.validationHtml = '重新发送' + time;
                                $scope.validationEnable = true;
                                $scope.validationDisabled = false;
                            }
                        };

                    if (data.ShortMessage) {
                        Util.msgToast($scope, data.ShortMessage);
                        $scope.validationDisabled = true;
                        $scope.validationEnable = false;
                        $timeout(countdown, 0);
                    } else {
                        Util.msgToast($scope, data.msg || '手机号无效');
                    }

                }
            });

        };

        $scope.submitRegistered = function () {
            console.log($scope.inputVal.enterpriseCode);
            if (!$scope.inputVal.phoneNumber) {
                Util.msgToast($scope, '请输入手机号码');
                return;
            }

            if (!/^1[3|4|5|8][0-9]\d{4,8}$/.test($scope.inputVal.phoneNumber)) {
                Util.msgToast($scope, '联系手机格式不合法');
                return;
            }

            if (!$scope.inputVal.validationCode) {
                Util.msgToast($scope, '请输入验证码');
                return;
            }

            // if ($scope.inputVal.validationCode && $scope.inputVal.validationCode !== $scope.validationDataCode) {
            //     Util.msgToast($scope, '验证码不正确');
            //     return;
            // }

            if (!$scope.inputVal.passWord) {
                Util.msgToast($scope, '请输入密码');
                return;
            }

            if ($scope.inputVal.passWord.length <= 5) {
                Util.msgToast($scope, '密码必须大于或等于6位');
                return;
            }

            Util.ajaxRequest({
                isPopup: true,
                method: 'POST',
                url: '$server/Account/Regest',
                data: {
                    LoginName: $scope.inputVal.phoneNumber, //电话号码
                    Password: $scope.inputVal.passWord, //密码
                    Code: $scope.inputVal.enterpriseCode || 0, //企业码
                    CheckCode: $scope.inputVal.validationCode //验证码
                },
                success: function (data) {
                    if (data.state === 999) {
                        Util.msgToast($scope, data.msg);
                    }

                    if (data.state === 200) {
                        DataCachePool.push('USERNAME', $scope.inputVal.phoneNumber);
                        DataCachePool.push('USERAUTH', data.Auth, 2 / 24); //存入用户Auth，并设置过期时间

                        var disclaimer = '我是免责我是免责声明我是免责声明我是免责声明我是免责声明我是免责声明我是免责声明我是免责声明我是免责声明我是免责声明我是免责声明';

                        $ionicPopup.alert({
                            template: '<h4>免责声明</h4><ion-scroll>' + disclaimer + '</ion-scroll><h3>恭喜您，注册成功</h3>',
                            buttons: [{
                                text: '开始购物吧',
                                type: 'button-positive',
                                onTap: function () {
                                    $state.go('epbuy.home');
                                }
                            }]
                        });
                    }
                    
                },
                error: function (data) {
                    Util.msgToast($scope, '注册失败请重试或检查网络');
                }
            });


        };

    });