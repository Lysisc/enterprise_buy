'use strict';

angular.module('EPBUY', ['ionic', 'pasvaz.bindonce'])
    .config(function ($stateProvider, $urlRouterProvider) {
        /**
         * EPBUY 状态路由配置
         */
        $stateProvider
            .state('epbuy', {
                abstract: true, // 为子状态提供一个 base url，其下所有子状态的 url 都是相对父状态的
                url: '/epbuy',
                templateUrl: 'scripts/epbuy/main.html'
            })
            // 引导页
            .state('epbuy.guide', {
                url: '/guide',
                templateUrl: 'scripts/epbuy/guide/guide.html',
                controller: 'GuideCtrl'
            })
            // 登陆页
            .state('epbuy.login', {
                url: '/login?OtherPage',
                templateUrl: 'scripts/epbuy/login/login.html',
                controller: 'LoginCtrl'
            })
            // 忘记密码页
            .state('epbuy.forget-password', {
                url: '/forget-password',
                templateUrl: 'scripts/epbuy/forget-password/forget-password.html',
                controller: 'ForgetPasswordCtrl'
            })
            // 注册页
            .state('epbuy.registered', {
                url: '/registered',
                templateUrl: 'scripts/epbuy/registered/registered.html',
                controller: 'RegisteredCtrl'
            })
            // 首页
            .state('epbuy.home', {
                url: '/home',
                templateUrl: 'scripts/epbuy/home/home.html',
                controller: 'HomeCtrl'
            })
            // 商品列表页
            .state('epbuy.list', {
                url: '/list',
                templateUrl: 'scripts/epbuy/list/list.html',
                controller: 'ListCtrl'
            })
            // 想要列表页
            .state('epbuy.heart', {
                url: '/heart',
                templateUrl: 'scripts/epbuy/list/list.html',
                controller: 'ListCtrl'
            })
            // 还想要页
            .state('epbuy.want-more', {
                url: '/want-more',
                templateUrl: 'scripts/epbuy/want-more/want-more.html',
                controller: 'WantMoreCtrl'
            })
            // 商品详情页
            .state('epbuy.detail', {
                url: '/detail/:GoodsId',
                templateUrl: 'scripts/epbuy/detail/detail.html',
                controller: 'DetailCtrl'
            })
            // 想要列表页
            .state('epbuy.want', {
                url: '/want/:GoodsId',
                templateUrl: 'scripts/epbuy/detail/detail.html',
                controller: 'DetailCtrl'
            })
            // 购物车页
            .state('epbuy.cart', {
                url: '/cart',
                templateUrl: 'scripts/epbuy/cart/cart.html',
                controller: 'CartCtrl'
            })
            // 订单页
            .state('epbuy.order', {
                url: '/order',
                templateUrl: 'scripts/epbuy/order/order.html',
                controller: 'OrderCtrl'
            })
            // 支付页
            .state('epbuy.payment', {
                url: '/payment',
                templateUrl: 'scripts/epbuy/payment/payment.html',
                controller: 'PaymentCtrl'
            })
            // 管理收货地址页
            .state('epbuy.address', {
                url: '/address',
                templateUrl: 'scripts/epbuy/address/address.html',
                controller: 'AddressCtrl'
            })
            // 选择收货地址页
            .state('epbuy.choice', {
                url: '/choice?AddressId',
                templateUrl: 'scripts/epbuy/address/address.html',
                controller: 'AddressCtrl'
            })
            // 编辑&添加企业收货地址页
            .state('epbuy.e-address', {
                url: '/e-address?AddressId',
                templateUrl: 'scripts/epbuy/edit-address/edit-address.html',
                controller: 'EditAddressCtrl'
            })
            // 编辑&添加个人收货地址页
            .state('epbuy.p-address', {
                url: '/p-address?AddressId',
                templateUrl: 'scripts/epbuy/edit-address/edit-address.html',
                controller: 'EditAddressCtrl'
            })
            // 个人主页
            .state('epbuy.person', {
                url: '/person',
                templateUrl: 'scripts/epbuy/person/person.html',
                controller: 'PersonCtrl'
            })
            // 个人信息页
            .state('epbuy.personal-info', {
                url: '/personal-info',
                templateUrl: 'scripts/epbuy/personal-info/personal-info.html',
                controller: 'PersonInfoCtrl'
            })
            // 我的收藏
            .state('epbuy.favorite', {
                url: '/favorite',
                templateUrl: 'scripts/epbuy/favorite/favorite.html',
                controller: 'FavoriteCtrl'
            })
            // 我的积分
            .state('epbuy.integral', {
                url: '/integral',
                templateUrl: 'scripts/epbuy/integral/integral.html',
                controller: 'IntegralCtrl'
            })
            // 修改手机号码&修改密码
            .state('epbuy.modify-pp', {
                url: '/modify-pp?type',
                templateUrl: 'scripts/epbuy/modify-pp/modify-pp.html',
                controller: 'ModifyPpCtrl'
            })
            // 订单列表页
            .state('epbuy.order-list', {
                url: '/order-list?type',
                templateUrl: 'scripts/epbuy/order-list/order-list.html',
                controller: 'OrderListCtrl'
            })
            // 订单详情页
            .state('epbuy.order-detail', {
                url: '/order-detail/:OrderId',
                templateUrl: 'scripts/epbuy/order-detail/order-detail.html',
                controller: 'OrderDetailCtrl'
            })


        // 目的地切换
        .state('epbuy.destinationSwitch', {
            url: '/destinationSwitch',
            templateUrl: 'scripts/epbuy/destination/destination-switch.html',
            controller: 'DestinationSwitchCtrl'
        });

        // 处理在状态配置中指定的路由之外的 url 请求
        var isShowGuide = localStorage.getItem('EPBUY_SHOWED_GUIDE');
        if (isShowGuide && JSON.parse(isShowGuide).value === 1) {
            $urlRouterProvider.otherwise('/epbuy/login');
        } else {
            $urlRouterProvider.otherwise('/epbuy/guide');
        }

    });