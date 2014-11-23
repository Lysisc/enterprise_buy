'use strict';

angular.module('EPBUY', ['ionic', 'pasvaz.bindonce']).config(function ($stateProvider, $urlRouterProvider) {
    /**
     * EPBUY 状态路由配置
     */
    $stateProvider
    /* 美食新前端 */
    .state('epbuy', {
        abstract: true, // 为子状态提供一个 base url，其下所有子状态的 url 都是相对父状态的
        url: '/epbuy',
        templateUrl: 'scripts/epbuy/main.html'
    })
    // 首页前置页面
    .state('epbuy.homefront', {
        url: '/homefront',
        templateUrl: 'scripts/epbuy/homefront/foods-homefront.html',
        controller: 'FoodsHomeFrontCtrl'
    })
    // 首页
    .state('epbuy.home', {
        url: '/home',
        templateUrl: 'scripts/epbuy/home/foods-home.html',
        controller: 'FoodsHomeCtrl'
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
    $urlRouterProvider.otherwise('/epbuy/homefront');
});