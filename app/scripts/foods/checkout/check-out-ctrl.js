'use strict';

angular.module('GSH5')
    .controller('CheckoutCtrl', function ($scope, $http, $location, $stateParams, $timeout, $userService, $compile, pageStatus, ENV, Notification) {
        $scope.restName = $stateParams.RestaurantName;
        $scope.info = {};

        $scope.clearNoNum = function (e) {
            var obj = e.target;
            obj.value = obj.value.replace(/[^\d.]/g, '');
            obj.value = obj.value.replace(/^\./g, '');
            obj.value = obj.value.replace(/\.{2,}/g, '.');
            obj.value = obj.value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
        };

        var pageStatusInit = pageStatus.pageStatusInit($scope, $compile, $stateParams);

        var PAYMENT_LINKS = {
            waptest: 'https://secure.fat18.qa.nt.ctripcorp.com/webapp/payment2/index.html#index',
            uat: 'https://secure.uat.qa.nt.ctripcorp.com/webapp/payment2/index.html#index',
            baolei: 'https://secure.ctrip.com/webapp/payment2/index.html#index',
            preProduction: 'https://secure.ctrip.com/webapp/payment2/index.html#index'
        };

        var generatePayWayUrl = function (data, isInApp) { //跳转支付页面函数
            var baseUrl = isInApp ? 'payment2/index.html#index' : PAYMENT_LINKS[ENV.getMode()],
                domain,
                extend;

            if (isInApp) {
                domain = window.location.host;
            } else {
                domain = 'http://' + window.location.host;
            }

            data.oid = data.oid.toString(10);

            if (!isInApp) {
                data.sback = domain + data.sback.split('file:/')[1].replace('index.html', 'index.html').replace('webapp_work', 'webapp');
                data.eback = domain + data.eback.split('file:/')[1].replace('index.html', 'index.html').replace('webapp_work', 'webapp');
            }

            //扩展信息，风控参数
            extend = {
                IsNeedCardRisk: true
            };

            return baseUrl + '?' +
                'bustype=' + data.bustype +
                '&oid=' + data.oid +
                '&token=' + window.encodeURIComponent(window.Base64.encode(JSON.stringify(data))) +
                '&extend=' + window.encodeURIComponent(window.Base64.encode(JSON.stringify(extend)));

        };

        $scope.checkout = function () { // 去支付

            if ($userService.needLogin()) {
                $userService.memberLogin({
                    sourcePath: window.location.href,
                    replace: true,
                    type: 0,
                    done: null,
                    fail: null
                });
                return false;
            }

            if (!$scope.info.amount) {
                Notification.notify($scope, '请输入金额');
                return;
            }
            if (!/^([1-9][\d]*|0)(\.[\d]{1,2})?$/.test($scope.info.amount)) {
                Notification.notify($scope, '金额格式不合法');
                return;
            }
            if (!$scope.info.contact) {
                Notification.notify($scope, '请输入联系手机');
                return;
            }
            if (!/^1[3|4|5|8][0-9]\d{4,8}$/.test($scope.info.contact)) {
                Notification.notify($scope, '联系手机格式不合法');
                return;
            }

            pageStatusInit.loading(false);

            $http({
                url: ENV.getDomain().replace(/10332$/g, '10267/') + 'AppPaymentReferenceIDGet.json?__' + new Date().getTime(),
                method: 'POST',
                data: {
                    RequestHead: {
                        Channel: '2150',
                        ExternalChannel: '',
                        Auth: $userService.getAuth(),
                        Culture: 'zh-CN',
                        SessionId: '1d667dfd-f00f-41cf-9b5e-02f7cbe9e31c',
                        ClientIP: ''
                    }
                }
            }).success(function (res) {
                var data = res || {};
                var requestid = 0;
                if (data.Body && data.Body.ReferenceID) {
                    requestid = data.Body.ReferenceID;
                } else {
                    pageStatusInit.loadError();
                    Notification.notify($scope, '请求失败，请重试');
                    return false;
                }

                var searchInfo = $location.search();
                var restId = searchInfo.restid || 0;
                var orderAmount = parseInt($scope.info.amount);
                var productId = parseInt(searchInfo.proid) || 0;
                var salesId = parseInt(searchInfo.salesid) || 0;
                var rebateAmount = 0;

                if (searchInfo.rebateper) {
                    var amount = orderAmount * parseInt(searchInfo.rebateper) / 100;
                    rebateAmount = Math.round(amount);
                }

                if (searchInfo.rebate && orderAmount >= parseInt(searchInfo.rebateflag)) {
                    rebateAmount = Math.round(searchInfo.rebate);
                }

                $http({
                    url: ENV.getDomain().replace(/10332$/g, '10267/') + 'AppOrderCreateV2.json?__' + new Date().getTime(),
                    method: 'POST',
                    data: {
                        RequestHead: {
                            Channel: '2150',
                            ExternalChannel: '',
                            Culture: 'zh-CN',
                            Auth: $userService.getAuth(),
                            SessionId: '1d667dfd-f00f-41cf-9b5e-02f7cbe9e31c'
                        },
                        Body: {
                            OrderAmount: orderAmount,
                            MobilePhone: $scope.info.contact,
                            RebateInfo: {
                                Type: 0,
                                Amount: rebateAmount
                            },
                            ProductInfo: {
                                Id: productId,
                                Type: 1,
                                Count: 1,
                                SalesPolicyId: salesId
                            },
                            CurrencyType: 'RMB',
                            ExchangeRate: 1,
                            LocalOrderAmount: orderAmount,
                            head: $userService.getRequestHead()
                        }
                    }
                }).success(function (res) {
                    if (res && res.Body && res.Body.OrderId) {
                        var token = {
                            oid: res.Body.OrderId, //订单号
                            bustype: 3001, //业务线编号
                            requestid: requestid, //支付请求ID(需全局唯一)
                            islogin: 0, //是否会员登录 0=会员1=非会员
                            from: window.location.href, //跳转支付前页面的URL
                            rback: window.location.href.split('#')[0] + '#/foods/rest/' + restId, //第三方支付返回跳转URL
                            sback: 'file://webapp_work/topshop/index.html#complete?orderid=' + res.Body.OrderId + '&isfrompg=1', //支付成功回调页面
                            eback: 'file://webapp_work/topshop/index.html#complete?orderid=' + res.Body.OrderId + '&isfrompg=1', //支付错误跳转URL
                            auth: $userService.getAuth(), //登陆后服务端下发的auth
                            title: $scope.restName,
                            amount: orderAmount,
                            recall: '',
                            currency: 'CNY',
                            needInvoice: false, //是否需要发票
                            IsNeedCardRisk: true
                        };

                        if (ENV.isHybrid) {
                            window.CtripUtil.app_open_url(generatePayWayUrl(token, ENV.isHybrid), 4, '支付方式', null);
                        } else {
                            window.location.href = generatePayWayUrl(token, ENV.isHybrid);
                        }

                    } else {
                        pageStatusInit.loadError();
                        Notification.notify($scope, '请求失败，请重试');
                    }
                }).error(function () {
                    pageStatusInit.loadError();
                    Notification.notify($scope, '请求失败，请重试');
                });

            }).error(function () {
                pageStatusInit.loadError();
                Notification.notify($scope, '请求失败，请重试');
            });


        };
    });
