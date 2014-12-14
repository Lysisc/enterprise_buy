'use strict';

angular.module('EPBUY')

// 分享
.directive('shareCtrl', function () {
    return {
        restrict: 'A',
        link: function (scope, element) {
            element.on('focus blur', function (e) {
                var labelObj = angular.element(e.path[1]);
                if (e.type === 'focus') {
                    labelObj.addClass('focus');
                } else {
                    labelObj.removeClass('focus');
                }
            });
        }
    };
});