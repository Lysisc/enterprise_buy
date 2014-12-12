'use strict';

angular.module('EPBUY')
    .controller('DetailCtrl', function ($scope, $stateParams, $ionicSlideBoxDelegate, $timeout, $userService, $state, Util) {

        $scope.titleName = '我是商品名称';

        Util.ajaxRequest({
            url: 'GetHomeRestaurantBannerInfo',
            data: {
                enterpriseCode: $scope.enterpriseCode // todo...
            },
            success: function (data) {
                $scope.goodsPictureList = data.commentList; //取数据 todo...
                console.log($ionicSlideBoxDelegate);
                // $ionicSlideBoxDelegate.update();

                $timeout(function () {
                    var slideBox = angular.element(document.querySelector('.slide-box'));
                    slideBox.addClass('special');
                    console.log(slideBox);
                }, 100);
            }
        });


    });
