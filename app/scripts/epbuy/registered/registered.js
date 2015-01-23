'use strict';

angular.module('EPBUY')
    .controller('RegisteredCtrl', function ($cacheFactory, $scope, $state, $ionicPopup, $timeout, Util, DataCachePool) {

        $scope.stepInit = true; //step1 view
        $scope.legalNotice = true;
        $scope.stepOneDisabled = true; //step1 submit
        $scope.stepOnePass = false; //step2 view
        $scope.stepTwoDisabled = true; //step2 submit
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
                            name: $scope.inputVal.searchVal
                        },
                        success: function (data) {
                            if (data.enterpriselist && data.enterpriselist.length > 0) {
                                $scope.searchResultList = data.enterpriselist;
                            } else {
                                $scope.searchResultList = false;
                            }
                        },
                        error: function (data) {
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

        $scope.hasAgreed = function () {
            $scope.legalNotice = false;
        };

        $scope.goStepTwo = function () { //去第二步

            Util.ajaxRequest({
                isPopup: true,
                url: '$server/Account/EnterpriseCheck',
                data: {
                    Code: $scope.inputVal.enterpriseCode
                },
                success: function (data) {
                    if (data.state === 200) {
                        $scope.stepInit = false;
                        $scope.stepOnePass = true;
                    } else if (data.state === 999) {
                        var alertPopup = $ionicPopup.alert({
                            template: '抱歉，企业码不存在',
                            buttons: [{
                                text: '知道了'
                            }]
                        });
                        // alertPopup.then(function (res) {
                        //     console.log(res);
                        // });
                    } else {
                        Util.msgToast(data.msg);
                    }
                }
            });

        };

        $scope.submitRegistered = function () {
            if (!$scope.inputVal.phoneNumber) {
                Util.msgToast('请输入手机号码');
                return;
            }

            if (!/^1[3|4|5|7|8][0-9]\d{4,8}$/.test($scope.inputVal.phoneNumber)) {
                Util.msgToast('手机号码格式不合法');
                return;
            }

            if (!$scope.inputVal.validationCode) {
                Util.msgToast('请输入验证码');
                return;
            }

            if (!$scope.inputVal.password) {
                Util.msgToast('请输入密码');
                return;
            }

            if ($scope.inputVal.password.length <= 5) {
                Util.msgToast('密码必须大于或等于6位');
                return;
            }

            Util.ajaxRequest({
                isPopup: true,
                method: 'POST',
                url: '$server/Account/Regest',
                data: {
                    LoginName: $scope.inputVal.phoneNumber, //电话号码
                    Password: $scope.inputVal.password, //密码
                    Code: $scope.inputVal.enterpriseCode || 0, //企业码
                    CheckCode: $scope.inputVal.validationCode //验证码
                },
                success: function (data) {
                    if (data.state === 999) {

                        $ionicPopup.alert({
                            template: data.msg,
                            buttons: [{
                                text: '知道了',
                                type: 'button-positive'
                            }]
                        });

                    } else if (data.state === 888) {

                        $ionicPopup.alert({
                            template: data.msg,
                            buttons: [{
                                text: '知道了',
                                type: 'button-positive',
                                onTap: function () {
                                    $state.go('epbuy.login');
                                }
                            }]
                        });

                    } else if (data.state === 200) {

                        $ionicPopup.alert({
                            template: '<h3>恭喜您，注册成功</h3>',
                            buttons: [{
                                text: '开始购物吧',
                                type: 'button-positive',
                                onTap: function () {

                                    Util.ajaxRequest({ //调用登录接口
                                        url: '$server/Account/Login',
                                        data: {
                                            LoginName: $scope.inputVal.phoneNumber,
                                            Password: $scope.inputVal.password
                                        },
                                        success: function (data) {
                                            if (data.UserEntity) {

                                                DataCachePool.remove('DEFAULT_ADDRESS');
                                                DataCachePool.remove('DEFAULT_CONSIGNEE');
                                                DataCachePool.remove('SHOPPING_CART');
                                                DataCachePool.remove('COLLECTION_GOODS');
                                                DataCachePool.remove('STATEMENT');
                                                DataCachePool.push('REMEMBER_LOGIN', 1);
                                                DataCachePool.push('USERNAME', $scope.inputVal.phoneNumber);
                                                DataCachePool.push('USERAUTH', data.UserEntity.Auth, 2 / 24); //存入用户Auth，并设置过期时间

                                                $state.go('epbuy.home');

                                            } else {
                                                Util.msgToast(data.msg);
                                            }
                                        }
                                    });
                                }
                            }]
                        });
                    }

                }
            });

        };

    });
