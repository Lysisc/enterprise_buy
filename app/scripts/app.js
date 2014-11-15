angular.module('GSH5', ['ionic', 'pasvaz.bindonce']).config(function($stateProvider, $urlRouterProvider) {
    /**
     * GSH5 状态路由配置
     */
    $stateProvider
    /* 美食新前端 */
    .state('foods', {
        abstract: true, // 为子状态提供一个 base url，其下所有子状态的 url 都是相对父状态的
        url: '/foods',
        templateUrl: 'scripts/foods/foods-main.html'
    })
    // 首页前置页面
    .state('foods.homefront', {
        url: '/homefront',
        templateUrl: 'scripts/foods/homefront/foods-homefront.html',
        controller: 'FoodsHomeFrontCtrl'
    })
    // 首页
    .state('foods.home', {
        // url: '/home?ViewDestId&ViewDestName',
        url: '/home',
        templateUrl: 'scripts/foods/home/foods-home.html',
        controller: 'FoodsHomeCtrl'
    })
    // 目的地切换
    .state('foods.destinationSwitch', {
        url: '/destinationSwitch',
        templateUrl: 'scripts/foods/destination/destination-switch.html',
        controller: 'DestinationSwitchCtrl'
    })
    // 餐馆详情页
    .state('foods.restaurant', {
        url: '/rest/:RestaurantId',
        templateUrl: 'scripts/foods/rest/foods-restaurant.html',
        controller: 'FoodsRestaurantCtrl'
    })
    // 特色美食页
    .state('foods.specialfood', {
        url: '/spec/:DestinationId',
        templateUrl: 'scripts/foods/spec/foods-specialfood.html',
        controller: 'FoodsSpecialFoodCtrl'
    })
    // 人气排行页
    .state('foods.hot', {
        url: '/hot/:DestinationId',
        templateUrl: 'scripts/foods/hot/foods-hot.html',
        controller: 'FoodsHotCtrl'
    })
    // 热门团购页
    // .state('foods.group', {
    //   //url为/group/目的地ID
    //   url: '/group/:districtId',
    //   templateUrl: 'scripts/foods/group/foods-group.html',
    //   controller: 'FoodsGroupCtrl'
    // })
    // 搜索结果页 & 发现美食页
    .state('foods.findfoods', {
        //url为 /findfoods/目的地ID
        url: '/findfoods/:DestinationId',
        templateUrl: 'scripts/foods/findfoods/foods-findfoods.html',
        controller: 'FindFoodsCtrl'
    })
    // 在线结账
    .state('foods.checkout', {
        url: '/checkout/:RestaurantName',
        templateUrl: 'scripts/foods/checkout/check-out.html',
        controller: 'CheckoutCtrl'
    });
    // 写点评
    // .state('foods.addcomment', {
    //   //url为 /addcomment/点评对象ID
    //   url: '/addcomment/:commentId',
    //   templateUrl: 'scripts/foods/addcomment/foods-addcomment.html',
    //   controller: 'foodsAddcomment'
    // })
    // 全部点评
    // .state('foods.allcomments', {
    //   //url为 /commentlist/点评对象ID
    //   url: '/allcomments/:commentId',
    //   templateUrl: 'scripts/foods/allcomments/foods-allcomments.html',
    //   controller: 'AllCommentsCtrl'
    // });
    // 处理在状态配置中指定的路由之外的 url 请求
    $urlRouterProvider.otherwise('/foods/homefront');
});