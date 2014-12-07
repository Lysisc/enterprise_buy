'use strict';

angular.module('EPBUY')
    .controller('FoodsSpecialFoodCtrl', function ($scope, $compile, $state, $timeout, $ionicBackdrop, $stateParams, $http, $ionicScrollDelegate, ENV, pageStatus, Util) {
        $scope.formatRestaurantName = Util.formatRestaurantName;
        $scope.foodsNum = 10;

        var titleEles, handler = $ionicScrollDelegate.$getByHandle('scrollContent');

        var pageStatusHandler = pageStatus.pageStatusInit($scope, $stateParams);

        pageStatusHandler.loading(false);
        $http.get(ENV.getDomain() + '/GetSpecialFoodPageViewModel?DestinationId=' + $stateParams.DestinationId).success(function (specialFood) {
            if (specialFood) {
                // 转换地址数组为二级数组，一级数组中的每个元素包含有三个元素组成的子数组，方便页面循环的逻辑
                if (specialFood.SpecialFoodViewModels) {
                    for (var i = 0; i < specialFood.SpecialFoodViewModels.length; i++) {
                        var arr = specialFood.SpecialFoodViewModels[i].RestaurantViewModels,
                            subArr = [];
                        specialFood.SpecialFoodViewModels[i].RestaurantViewModels = [];
                        for (var j = 0; j < arr.length && j < 9; j++) {
                            subArr.push(arr[j]);
                            if ((j + 1) % 3 === 0) {
                                specialFood.SpecialFoodViewModels[i].RestaurantViewModels.push(subArr);
                                subArr = [];
                            }
                        }
                        if (subArr.length > 0) {
                            while (subArr.length < 3) {
                                subArr.push({});
                            }
                            specialFood.SpecialFoodViewModels[i].RestaurantViewModels.push(subArr);
                        }
                    }
                }
                // 优化描述信息
                if (specialFood.DestinationFoodIntroduction) {
                    specialFood.DestinationFoodIntroduction = specialFood.DestinationFoodIntroduction.replace(/<p>\s*<\/p>/ig, '').replace('</p><p>', '<br/>').replace(/<p>|<\/p>/ig, '').replace(/<br\s*\/>/ig, '<br/>');
                }

                $scope.specialFood = specialFood;

                $timeout(function () {
                    titleEles = window.document.querySelectorAll('.page-scroll .scroll h2');
                }, 0);
                pageStatusHandler.loadSuccess();
            } else {
                pageStatusHandler.loadError(true);
            }
        }).error(function () {
            pageStatusHandler.loadError(true);
        });

        $scope.onScroll = function () {
            Util.stickyTopScroll($scope, titleEles, handler);
        };

        // 跳转餐馆详情页
        $scope.gotoDetailPage = function (restId) {
            window.location.href = '#/foods/rest/' + restId;
        };

        //展开收起跳顶部
        $scope.jumpToTop = function () {
            $ionicScrollDelegate.$getByHandle('scrollContent').scrollTo(0, true);
        };
    });