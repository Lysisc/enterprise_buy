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

        $scope.chooseItemSearch = function (e, itemId) { //选择企业
            console.log(itemId);
            angular.element(document.querySelectorAll('.search-item')).removeClass('cur');
            angular.element(e.target).addClass('cur');
            if (itemId) {
                $scope.inputVal.enterpriseCode = itemId;
                $scope.inputVal.searchVal = null;
                $scope.stepOneDisabled = false;
                $scope.searching = false;
            } else {
                console.log('itemId error');
            }
        };

        var searchTimer = null;
        $scope.searchChange = function () { //监听搜索输入框的值

            if ($scope.inputVal.searchVal) {

                $timeout.cancel(searchTimer);

                searchTimer = $timeout(function () {
                    Util.ajaxRequest({
                        noMask: true,
                        url: '$api/Account/QueryEnterpriseByName',
                        data: {
                            name: $scope.inputVal.searchVal // todo...
                        },
                        success: function (data) {
                            if (data.commentList && data.commentList.length > 0) {
                                $scope.searchResultList = data.commentList; //取数据 todo...
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

        $scope.goStepTwo = function () { //去第二步

            Util.ajaxRequest({
                isPopup: true,
                // method: 'POST',
                url: 'GetHomeRestaurantBannerInfo',
                data: {
                    enterpriseCode: $scope.inputVal.enterpriseCode
                },
                success: function (data) {
                    $scope.stepInit = false;
                    $scope.stepOnePass = true;
                    //todo...
                },
                error: function (data) {
                    Util.backDrop.retain();
                    var alertPopup = $ionicPopup.alert({
                        template: '抱歉，企业码无效',
                        buttons: [{
                            text: '知道了'
                        }]
                    });
                    alertPopup.then(function (res) {
                        console.log(res);
                    });
                }
            });

        };

        $scope.getVerificationCode = function () { //获取验证码

            Util.ajaxRequest({
                noMask: true,
                url: 'GetHomeRestaurantBannerInfo',
                data: {
                    enterpriseCode: $scope.inputVal.enterpriseCode // todo...
                },
                success: function (data) {
                    $scope.validationDataCode = 100;

                    $scope.validationDisabled = true;
                    $scope.validationEnable = false;

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

                    $timeout(countdown, 0);

                }
            });

        };

        $scope.submitRegistered = function () {
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

            if ($scope.inputVal.validationCode && $scope.inputVal.validationCode !== $scope.validationDataCode) {
                Util.msgToast($scope, '验证码不正确');
                return;
            }

            if (!$scope.inputVal.passWord) {
                Util.msgToast($scope, '请输入密码');
                return;
            }

            Util.ajaxRequest({
                isPopup: true,
                // method: 'POST',
                url: 'GetHomeRestaurantBannerInfo',
                data: {
                    passCode: $scope.passCode, //请求企业码返回的passCode
                    phoneNumber: $scope.inputVal.phoneNumber, //电话号码
                    validationCode: $scope.inputVal.validationCode, //验证码
                    passWord: $scope.inputVal.passWord //密码
                },
                success: function (data) {

                    DataCachePool.push('USERAUTH', data.UserEntity.Auth, 2 / 24); //存入用户Auth，并设置过期时间

                    $ionicPopup.alert({
                        template: '<h4>免责声明</h4><ion-scroll>我是免责申明我是免责申明我是免责申明我是免责申明我是免责申明我是免责申明我是免责申明我是免责申明我是免责申明我是免责申明我是免责申明我是免责申明我是免责申明我是免责申明我是免责申明我是免责申明我是免责申明我是免责申明我是免责申明我是免责申明我是免责申明我是免责申明我是免责申明我是免责申明我是免责申明我是免责申明</ion-scroll><h3>恭喜您，注册成功</h3>',
                        buttons: [{
                            text: '开始购物吧',
                            type: 'button-positive',
                            onTap: function () {
                                $state.go('epbuy.home');
                            }
                        }]
                    });

                },
                error: function (data) {
                    //todo... 注册失败信息
                    $ionicPopup.alert({
                        template: '抱歉，注册失败',
                        buttons: [{
                            text: '请重试',
                            type: 'button-positive',
                            onTap: function () {
                                // alert(1);
                            }
                        }]
                    });

                }
            });


        };

    });