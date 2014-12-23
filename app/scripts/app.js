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
                url: '/login',
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
                url: '/order/:CartNum&:CartPrice',
                templateUrl: 'scripts/epbuy/order/order.html',
                controller: 'OrderCtrl'
            })
            // 收货地址页
            .state('epbuy.address', {
                url: '/address/:Type?idx',
                templateUrl: 'scripts/epbuy/address/address.html',
                controller: 'AddressCtrl'
            })
            // 编辑收货地址页
            .state('epbuy.edit-address', {
                url: '/edit-address/:AddressId?type',
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
            // 修改手机号码&修改密码
            .state('epbuy.modify-pp', {
                url: '/modify-pp?type',
                templateUrl: 'scripts/epbuy/modify-pp/modify-pp.html',
                controller: 'ModifyPpCtrl'
            })
            // 全部订单页
            .state('epbuy.order-list', {
                url: '/order-list',
                templateUrl: 'scripts/epbuy/order-list/order-list.html',
                controller: 'OrderListCtrl'
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