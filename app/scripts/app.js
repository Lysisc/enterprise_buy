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
            // 目的地切换
            .state('epbuy.destinationSwitch', {
                url: '/destinationSwitch',
                templateUrl: 'scripts/epbuy/destination/destination-switch.html',
                controller: 'DestinationSwitchCtrl'
            })
            // 餐馆详情页
            .state('epbuy.restaurant', {
                url: '/rest/:RestaurantId',
                templateUrl: 'scripts/epbuy/rest/foods-restaurant.html',
                controller: 'FoodsRestaurantCtrl'
            })
            // 特色美食页
            .state('epbuy.specialfood', {
                url: '/spec/:DestinationId',
                templateUrl: 'scripts/epbuy/spec/foods-specialfood.html',
                controller: 'FoodsSpecialFoodCtrl'
            })
            // 人气排行页
            .state('epbuy.hot', {
                url: '/hot/:DestinationId',
                templateUrl: 'scripts/epbuy/hot/foods-hot.html',
                controller: 'FoodsHotCtrl'
            })
            // 搜索结果页 & 发现美食页
            .state('epbuy.findfoods', {
                url: '/findfoods/:DestinationId',
                templateUrl: 'scripts/epbuy/findfoods/foods-findfoods.html',
                controller: 'FindFoodsCtrl'
            });

        // 处理在状态配置中指定的路由之外的 url 请求
        var isShowGuide = localStorage.getItem('EPBUY_SHOW_GUIDE') || 1;
        if (parseInt(isShowGuide, 0) === 1) {
            $urlRouterProvider.otherwise('/epbuy/guide');
        } else {
            $urlRouterProvider.otherwise('/epbuy/login');
        }

    });
