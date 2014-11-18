'use strict';

angular.module('EPBUY').factory('Util', function () {
    /**
     * 安全的使用angular apply方法，以保证不会因为产生循环调用而抛出“$digest already in progress”
     * @param scope
     * @param fn
     */
    var safeApply = function (scope, fn) {
        if (!scope || !fn) {
            return;
        }
        if (scope.$$phase || (scope.$root && scope.$root.$$phase)) {
            fn();
        } else {
            scope.$apply(fn);
        }
    };

    /**
     * 带标题吸顶效果的页面滚卷处理
     * @param scope
     * @param titleEles
     * @param sticker
     * @param handler
     */
    var stickyTopScroll = function (scope, compile, titleEles, handler) {
        if (!scope || !titleEles || !titleEles.length || !handler || !handler.getScrollPosition()) {
            return;
        }

        var titleEle, height, targetEle, sticker,
            scrollTop = handler.getScrollPosition().top;

        if (scope.stickyContent === undefined) {
            var tpl = compile('<h2 class="sticker" ng-show="stickyContent != null">{{stickyContent}}</h2>');
            sticker = tpl(scope);
            sticker.css({
                position: 'absolute',
                width: '100%'
            });
            angular.element(handler.getScrollView().__container).append(sticker);
            handler.__sticker = sticker;
        } else {
            sticker = handler.__sticker;
        }

        // 滚卷处理
        for (var i = 0, len = titleEles.length; i < len; i++) {
            titleEle = titleEles[i];
            if (i === 0) {
                height = titleEle.clientHeight;
            }
            if (scrollTop >= titleEle.offsetTop) {
                targetEle = titleEle;
            } else {
                if (!sticker.hasClass('ng-hide')) {
                    if (scrollTop >= titleEle.offsetTop - height) {
                        sticker.css('top', (titleEle.offsetTop - height - scrollTop) + 'px');
                    } else {
                        sticker.css('top', 0);
                    }
                }
                break;
            }
        }

        if (targetEle && scope.stickyContent !== targetEle.innerHTML) {
            sticker.css('top', 0);
            safeApply(scope, function () {
                scope.stickyContent = targetEle.innerHTML;
            });
        } else if (!targetEle) {
            safeApply(scope, function () {
                scope.stickyContent = null;
            });
        }
    };

    /**
     * 格式化餐馆名称, Format：name·alias
     * @param name
     * @param alias
     */
    var formatRestaurantName = function (name, alias) {
        if (!name) {
            return '';
        }
        if (alias) {
            name += ' • ' + alias;
        }
        return name;
    };

    return {
        safeApply: safeApply,
        stickyTopScroll: stickyTopScroll,
        formatRestaurantName: formatRestaurantName
    };
});
