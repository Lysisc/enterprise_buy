'use strict';

angular.module('EPBUY')

// 默认背景配置
.directive('fallbackSrc', function () {
    return {
        link: function (scope, iElement, iAttrs) {
            var src = iAttrs.fallbackSrc;
            scope.fallbackSrc = src;
            iElement.bind('error', function () {
                if (iAttrs.fallbackSrc) {
                    angular.element(this).attr('src', src);
                    iAttrs.fallbackSrc = null;
                }
            });
        }
    };

});
