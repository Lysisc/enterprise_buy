'use strict';

angular.module('EPBUY')
    .controller('PersonCtrl', function ($scope, $state, $location, $ionicActionSheet, $ionicPopup, ENV, Util, DataCachePool) {

        Util.ajaxRequest({ // 取订三种单数
            url: '$server/Myself/GetOrderStatusCountByAuth',
            data: {
                Auth: DataCachePool.pull('USERAUTH')
            },
            success: function (data) {
                $scope.order = {
                    ordercount: data.ordercount,
                    ordercountpaying: data.ordercountpaying,
                    ordercountreceive: data.ordercountreceive
                };
            }
        });

        Util.ajaxRequest({ // 取剩余数据
            url: '$server/Myself/GetMySelfInfo',
            data: {
                Auth: DataCachePool.pull('USERAUTH')
            },
            success: function (data) {
                $scope.info = {
                    integral: data.AvailableIntegral,
                    companyId: data.AffiliatedCompanyCode,
                    companyName: data.AffiliatedCompanyName
                };
            }
        });

        if (ENV.isHybrid) { //取版本信息
            $scope.isHybrid = ENV.isHybrid;
            $scope.version = ENV.platform === 'IOS' ? ENV.iosVersion : ENV.androidVersion;
        }

        $scope.phoneNumber = DataCachePool.pull('USERNAME');
        $scope.favoriteList = DataCachePool.pull('COLLECTION_GOODS') || [];

        $scope.toJump = function (type) {
            switch (type) {
            case 'personal-info':
                $state.go('epbuy.personal-info');
                break;
            case 'all-order':
                $state.go('epbuy.order-list');
                break;
            case 'pay-order':
                $state.go('epbuy.order-list', {
                    type: 'pay'
                });
                break;
            case 'rec-order':
                $state.go('epbuy.order-list', {
                    type: 'rec'
                });
                break;
            case 'favorite':
                $state.go('epbuy.favorite');
                break;
            case 'integral':
                $state.go('epbuy.integral');
                break;
            case 'address':
                $state.go('epbuy.address');
                break;
            }
        };

        $scope.callPhone = function (phone) {
            $ionicActionSheet.show({
                buttons: [{
                    text: phone
                }],
                titleText: '<a>拨打电话</a>',
                buttonClicked: function (index) {
                    window.location.href = 'tel:' + phone;
                }
            });
        };

        $scope.aboutUs = function () {
            $ionicPopup.alert({
                template: '<h4>关于我们</h4><ion-scroll>企福惠诞生于CHIEF WAY，我们是一个专注于企业员工福利的网站，有兴趣？就进来试试吧！</ion-scroll>',
                buttons: [{
                    text: '朕知道了',
                    type: 'button-positive'
                }]
            });
        };

        $scope.goLogout = function () {
            $ionicPopup.confirm({
                template: '确认登出？',
                cancelText: '取消',
                okText: '确定'
            }).then(function (res) {
                if (res) {

                    DataCachePool.remove('USERAUTH');
                    $state.go('epbuy.login');

                    Util.ajaxRequest({
                        noMask: true,
                        url: '$server/Account/Logout',
                        data: {
                            Auth: DataCachePool.pull('USERAUTH')
                        }
                    });

                }
            });
        };

        $scope.getVersion = function () {
            Util.ajaxRequest({
                isPopup: true,
                url: '$server/Tools/GetAppInfo',
                data: {
                    AppType: ENV.platform // IOS || Android
                },
                success: function (data) {
                    if (data.state === 200 && data.App) {

                        if (data.App.Version !== $scope.version) {

                            $ionicPopup.confirm({
                                template: '有新版本更新！',
                                cancelText: '取消',
                                okText: '更新'
                            }).then(function (res) {
                                if (res) {
                                    window.open(data.App.DownloadUrl, '_system');
                                }
                            });

                        } else {

                            $ionicPopup.alert({
                                template: '版本已是最新！',
                                buttons: [{
                                    text: '知道了',
                                    type: 'button-positive'
                                }]
                            });

                        }
                    }
                }
            });
        };

    });
