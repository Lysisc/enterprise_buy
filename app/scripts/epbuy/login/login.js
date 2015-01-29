'use strict';

angular.module('EPBUY')
    .controller('LoginCtrl', function ($scope, $state, $window, $timeout, $ionicPopup, $ionicLoading, $stateParams, ENV, Util, DataCachePool) {

        $scope.otherPage = $stateParams.OtherPage;

        if (!$scope.otherPage) {
            Util.ajaxRequest({
                noMask: true,
                url: '$server/Account/CheckLogin',
                data: {
                    Auth: DataCachePool.pull('USERAUTH')
                },
                success: function (data) {
                    if (data.IsLogin) {
                        $state.go('epbuy.home');
                    }
                }
            });
        } else {
            Util.backDrop.release();
            $ionicLoading.hide();
        }

        $scope.inputVal = {}; //初始化ng-model
        $scope.inputVal.checked = DataCachePool.pull('REMEMBER_LOGIN') ? true : false;
        $scope.inputVal.phoneNumber = $scope.inputVal.checked ? DataCachePool.pull('USERNAME') : null;

        $scope.toJump = function (type) {
            switch (type) {
            case 'registered':
                $state.go('epbuy.registered');
                break;
            case 'forget-password':
                $state.go('epbuy.forget-password');
                break;
            }
        };

        $scope.getLogin = function () { //首页跳转

            if (!$scope.inputVal.phoneNumber) {
                Util.msgToast('请输入用户名');
                return;
            }

            if (!/^1[3|4|5|7|8][0-9]\d{4,8}$/.test($scope.inputVal.phoneNumber)) {
                Util.msgToast('用户名格式不合法');
                return;
            }

            if (!$scope.inputVal.password) {
                Util.msgToast('请输入密码');
                return;
            }

            Util.ajaxRequest({
                url: '$server/Account/Login',
                data: {
                    LoginName: $scope.inputVal.phoneNumber,
                    Password: $scope.inputVal.password
                },
                success: function (data) {
                    if (data.UserEntity) {

                        if ($scope.inputVal.checked) { //记住我
                            DataCachePool.push('REMEMBER_LOGIN', 1);
                        } else {
                            DataCachePool.remove('REMEMBER_LOGIN');
                        }

                        if ($scope.inputVal.phoneNumber !== DataCachePool.pull('USERNAME')) {
                            DataCachePool.remove('DEFAULT_ADDRESS');
                            DataCachePool.remove('DEFAULT_CONSIGNEE');
                            DataCachePool.remove('SHOPPING_CART');
                            DataCachePool.remove('COLLECTION_GOODS');
                            DataCachePool.remove('STATEMENT');
                        }

                        DataCachePool.push('USERNAME', $scope.inputVal.phoneNumber);
                        DataCachePool.push('USERAUTH', data.UserEntity.Auth, 2 / 24); //存入用户Auth，并设置过期时间

                        if (window.plugins && window.plugins.jPushPlugin) { //注册推送信息
                            window.plugins.jPushPlugin.setTagsWithAlias(['测试标签'], $scope.inputVal.phoneNumber);
                        }

                        if ($scope.otherPage) {
                            $window.history.back();
                        } else {
                            $state.go('epbuy.home');
                        }

                    } else {
                        Util.msgToast(data.msg || '用户名或密码错误');
                    }
                }
            });

        };

        $timeout(function () {
            if (ENV.isHybrid) {
                Util.ajaxRequest({
                    noMask: true,
                    isPopup: true,
                    url: '$server/Tools/GetAppInfo',
                    data: {
                        AppType: ENV.platform // IOS || Android
                    },
                    success: function (data) {
                        if (data.state === 200 && data.App) {

                            var version = data.App.AppType === 'IOS' ? ENV.iosVersion : ENV.androidVersion;

                            if (data.App.Version !== version) {

                                $ionicPopup.confirm({
                                    template: '有新版本更新！',
                                    cancelText: '取消',
                                    okText: '更新'
                                }).then(function (res) {
                                    if (res) {
                                        window.open(data.App.DownloadUrl, '_system');
                                    }
                                });

                            }
                        }
                    }
                });
            }
        }, 1500);

    });
