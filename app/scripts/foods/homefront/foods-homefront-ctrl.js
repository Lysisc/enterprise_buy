'use strict';

angular.module('EPBUY')
    .controller('FoodsHomeFrontCtrl', function ($scope, $http, ENV, $state) {
        // angular.element(window.document.getElementsByTagName('ion-nav-back-button')).remove();
        $scope.isHybrid = ENV.isHybrid;
        // if(!!$scope.isHybrid){
        // $scope.gwLink = 'ctrip://wireless/destination/toTTD?type=1&districtId=2';
        // $scope.ctripHomeLink = 'ctrip://wireless';
        // $scope.qqgLink = 'ctrip://wireless/h5?page=index.html#index&path=shopping';
        // }else{
        // $scope.gwLink = 'http://m.ctrip.com/you/shop/2/';
        // $scope.ctripHomeLink = 'http://m.ctrip.com/';

        // switch(ENV.getMode()){
        //   case 'waptest':
        //     $scope.qqgLink = 'http://w-shopping-m.uat.qa.nt.ctripcorp.com/webapp/shopping';
        //     break;
        //   case 'uat':
        //     $scope.qqgLink = 'http://w-shopping-m.uat.qa.nt.ctripcorp.com/webapp/shopping';
        //     break;
        //   case 'baolei':
        //     $scope.qqgLink = 'http://m.ctrip.com/webapp/shopping/index.html#index';
        //     break;
        //   case 'preProduction':
        //     $scope.qqgLink = 'http://m.ctrip.com/webapp/shopping/index.html#index';
        //     break;
        // }
        // }
        //高端美食跳转
        $scope.topfoodsJump = function () {
            if (!!$scope.isHybrid) {
                window.CtripUtil.app_open_url('ctrip://wireless/h5?page=index.html&path=topshop', 1);
            } else {
                switch (ENV.getMode()) {
                case 'waptest':
                    window.location.href = 'http://m.uat.qa.nt.ctripcorp.com/webapp/topshop/index.html#index';
                    break;
                case 'uat':
                    window.location.href = 'http://m.uat.qa.nt.ctripcorp.com/webapp/topshop/index.html#index';
                    break;
                case 'baolei':
                    window.location.href = 'http://m.ctrip.com/webapp/topshop/index.html#index';
                    break;
                case 'preProduction':
                    window.location.href = 'http://m.ctrip.com/webapp/topshop/index.html#index';
                    break;
                }
            }
        };
        //美食指南跳转
        $scope.foodsJump = function () {
            $state.go('foods.home');
        };
        //全球购跳转
        $scope.qqgJump = function () {
            if (!!$scope.isHybrid) {
                window.CtripUtil.app_open_url(
                    'ctrip://wireless/h5?page=index.html#index&path=shopping', 1);
            } else {
                switch (ENV.getMode()) {
                case 'waptest':
                    window.location.href = 'http://w-shopping-m.uat.qa.nt.ctripcorp.com/webapp/shopping';
                    break;
                case 'uat':
                    window.location.href = 'http://w-shopping-m.uat.qa.nt.ctripcorp.com/webapp/shopping';
                    break;
                case 'baolei':
                    window.location.href = 'http://m.ctrip.com/webapp/shopping/index.html#index';
                    break;
                case 'preProduction':
                    window.location.href = 'http://m.ctrip.com/webapp/shopping/index.html#index';
                    break;
                }
            }
        };
        //购物指南跳转
        $scope.gwJump = function () {
            if (!!$scope.isHybrid) {
                window.CtripUtil.app_open_url(
                    'ctrip://wireless/destination/toTTD?type=1&districtId=2', 1);
            } else {
                window.location.href = 'http://m.ctrip.com/you/shop/2/';
            }
        };

        $scope.RestaurantBanner = {};
        $scope.RestaurantBanner.linksrc = '';
        $scope.RestaurantBanner.img = '';
        $scope.ShoppingBanner = {};
        $scope.ShoppingBanner.linksrc = '';
        $scope.ShoppingBanner.img = '';


        if (!$scope.isHybrid) {
            //左侧图片
            $http({
                method: 'GET',
                url: ENV.getDomain() + '/GetHomeRestaurantBannerInfo.json'
            }).success(function (data) {
                if (data && data.BannerViewModelList && data.BannerViewModelList.length > 0) {
                    $scope.RestaurantBanner.linksrc = data.BannerViewModelList[0].HybridUrl;
                    $scope.RestaurantBanner.img = data.BannerViewModelList[0].PicUrl;
                }
            }).error(function () {});
            //右侧图片
            $http({
                method: 'GET',
                url: ENV.getDomain() + '/GetHomeShoppingBannerInfo.json'
            }).success(function (data) {
                if (data && data.BannerViewModelList && data.BannerViewModelList.length > 0) {
                    $scope.ShoppingBanner.linksrc = data.BannerViewModelList[0].HybridUrl;
                    $scope.ShoppingBanner.img = data.BannerViewModelList[0].PicUrl;
                }
            }).error(function () {});
        }

    });
