'use strict';

angular.module('EPBUY')
    .controller('GuideCtrl', function ($scope, $timeout, $state, $http, ENV) {

        var pager = null;

        $scope.$on('$viewContentLoaded', function () { //页面初始化处理

            $timeout(function () {

                pager = angular.element(document.querySelector('.slider-pager'));

                angular.element(pager[0].firstElementChild).html('1');
                angular.element(pager[0].lastElementChild).remove();

            });

        });

        $scope.slideHasChanged = function (index) { //引导页滑动时触发该事件

            pager.find('span').html('<i class="icon ion-record"></i>');
            pager.find('span').eq(index).html(index + 1);

            pager.css('display', index === 3 ? 'none' : 'block');

        };

        $scope.goHome = function () { //首页跳转

            $state.go('epbuy.home');
            localStorage.setItem('EPBUY_SHOW_GUIDE', 0);

        };

        $scope.isHybrid = ENV.isHybrid;
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
                console.log(data);
                if (data && data.BannerViewModelList && data.BannerViewModelList.length > 0) {
                    $scope.RestaurantBanner.linksrc = data.BannerViewModelList[0].HybridUrl;
                    $scope.RestaurantBanner.img = data.BannerViewModelList[0].PicUrl;
                }
            }).error(function () {});
        }

    });
