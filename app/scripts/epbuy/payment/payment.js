'use strict';

angular.module('EPBUY')
    .controller('PaymentCtrl', function ($scope, $state, $stateParams, $ionicPopup, Util, DataCachePool) {

        $scope.modeOfPayment = 'alipay';
        $scope.orderId = $stateParams.OrderId || 0;

        Util.ajaxRequest({
            url: '$server/Order/GetPayOrderDetail',
            data: {
                Auth: DataCachePool.pull('USERAUTH'),
                Id: $scope.orderId
            },
            success: function (data) {
                if (data.state === 200) {
                    $scope.data = data;
                } else {
                    Util.msgToast(data.msg);
                }
            }
        });

        /**
         * 动态创建iframe
         * @param dom 创建iframe的容器，即在dom中创建iframe。dom可以是div、span或者其他标签。
         * @param src iframe中打开的网页路径
         * @param onload iframe加载完后触发该事件，可以为空
         * @return 返回创建的iframe对象
         */
        function createIframe(dom, src, onload) {
            //在document中创建iframe
            var iframe = document.createElement('iframe');

            //设置iframe的样式
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.margin = '0';
            iframe.style.padding = '0';
            iframe.style.overflow = 'hidden';
            iframe.style.border = 'none';

            //绑定iframe的onload事件
            if (onload && Object.prototype.toString.call(onload) === '[object Function]') {
                if (iframe.attachEvent) {
                    iframe.attachEvent('onload', onload);
                } else if (iframe.addEventListener) {
                    iframe.addEventListener('load', onload);
                } else {
                    iframe.onload = onload;
                }
            }

            iframe.src = src;
            //把iframe加载到dom下面
            dom.appendChild(iframe);
            return iframe;
        }

        /**
         * 销毁iframe，释放iframe所占用的内存。
         * @param iframe 需要销毁的iframe对象
         */
        function destroyIframe(iframe) {
            //把iframe指向空白页面，这样可以释放大部分内存。
            iframe.src = 'about:blank';
            try {
                iframe.contentWindow.document.write('');
                iframe.contentWindow.document.clear();
            } catch (e) {}
            //把iframe从页面移除
            iframe.parentNode.removeChild(iframe);
        }

        $scope.submitPayment = function (mode) {

            Util.ajaxRequest({
                isPopup: true,
                url: '$server/Account/CheckLogin',
                data: {
                    Auth: DataCachePool.pull('USERAUTH')
                },
                success: function (data) {
                    if (data.IsLogin) {

                        if (!mode) {
                            Util.msgToast('请选择支付方式');
                            return;
                        } else if (mode === 'alipay') {
                            var dom = document.getElementById('iframeBox'),
                                src = 'http://172.16.125.147:3000/scripts/epbuy/payment/aaa.html',
                                // src = 'http://www.51mart.com.cn/Service/Pay/AliPayPage/Default.aspx?Id=' + $scope.orderId + '&Auth=' + DataCachePool.pull('USERAUTH'),
                                iframe = createIframe(dom, src);

                            dom.style.zIndex = 20;

                            // window.location.href = 'http://www.51mart.com.cn/Service/Pay/AliPayPage/Default.aspx?Id=' + $scope.orderId + '&Auth=' + DataCachePool.pull('USERAUTH');
                        } else if (mode === 'integral') {
                            Util.ajaxRequest({
                                isForm: true,
                                method: 'POST',
                                url: '$server/Order/IntegralPay',
                                data: {
                                    Auth: DataCachePool.pull('USERAUTH'),
                                    Id: $scope.orderId
                                },
                                success: function (data) {
                                    if (data.state === 200) {
                                        $state.go('epbuy.order-detail', {
                                            OrderId: $scope.orderId,
                                            from: 'paid'
                                        });
                                    } else {
                                        Util.msgToast(data.msg);
                                    }
                                }
                            });
                        }

                    } else {
                        $ionicPopup.alert({
                            template: '请重新登录',
                            buttons: [{
                                text: '知道了',
                                type: 'button-positive',
                                onTap: function () {
                                    $state.go('epbuy.login', {
                                        OtherPage: 1
                                    });
                                }
                            }]
                        });
                    }
                }
            });

        };

    });
