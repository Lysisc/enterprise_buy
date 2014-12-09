'use strict';

angular.module('EPBUY')

// input框focus，blur样式
.directive('focusEffect', function () {
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
