'use strict';

angular.module('EPBUY')

// 收藏
.directive('collectionCtrl', function ($parse, $ionicPopup, Util) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            var hasClick = false;
            element.on('click', function (e) {

                if (hasClick) {
                    return false;
                } else {
                    hasClick = true;
                    Util.ajaxRequest({
                        url: '$local/GetHomeRestaurantBannerInfo.json',
                        data: {
                            enterpriseCode: scope.enterpriseCode // todo...
                        },
                        success: function (data) {
                            hasClick = false;
                            if (data) {
                                scope.hasCollection = true;
                                Util.msgToast(scope, '收藏成功');
                            } else {
                                Util.msgToast(scope, '收藏失败');
                            }

                        },
                        error: function (data) {
                            hasClick = false;
                            Util.msgToast(scope, '收藏失败');
                        }
                    });
                }

            });
        }
    };
});