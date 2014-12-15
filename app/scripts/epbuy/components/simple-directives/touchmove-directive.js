'use strict';

angular.module('EPBUY')

// 触摸移动
.directive('touchMove', function ($parse) {
    return {
        restrict: 'A',
        compile: function ($element, attr) {
            var fn = $parse(attr.touchMove);
            return function (scope, element) {
                element.on('touchstart', function (event) {
                    scope.$apply(function () {
                        fn(scope, {
                            $event: event,
                            $target: event.target
                        });
                    });
                });

                element.on('touchmove', function (event) {
                    var thisTouch = event.touches[0],
                        target = document.elementFromPoint(
                            thisTouch.clientX,
                            thisTouch.clientY
                        );
                    scope.$apply(function () {
                        fn(scope, {
                            $event: event,
                            $target: target
                        });
                    });
                    event.preventDefault();
                });
            };
        }
    };
});
