'use strict';

angular.module('EPBUY').factory('Util', function ($http, $compile, $ionicLoading, $timeout, ENV) {

    var backDropDom = angular.element(document.querySelector('.backdrop'));

    if (!backDropDom) {
        angular.element(document.getElementsByTagName('body')[0]).append('<div class="backdrop"></div>');
    }

    var backDrop = { //重写遮罩层显示隐藏
        retain: function () {
            backDropDom.addClass('visible active');
        },
        release: function () {
            backDropDom.removeClass('active');
            $timeout(function () {
                backDropDom.removeClass('visible');
            }, 100);
        }
    };

    /**
     * toast提示层
     * @param scope, msg, time
     */
    var toastTimer = null;
    var msgToast = function (scope, msg, time) {
        var toastDom = angular.element(document.querySelector('.notifier'));

        if (!toastDom.length) {
            var toastTpl = $compile('<div class="notifier" ng-show="notification"><span>{{notification}}</span></div>');
            angular.element(document.getElementsByTagName('ion-nav-view')[0]).append(toastTpl(scope));
        }

        scope.notification = msg;

        $timeout.cancel(toastTimer);

        toastTimer = $timeout(function () {
            scope.notification = '';
        }, time || 2000);

    };

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
     * ajax请求
     * @param param = {
        method: 请求方式,
        url: 请求地址,
        success: 请求成功回调,
        error: 请求失败回调,
        data: 'POST数据',
        noLoad: 请求结果是否需要loading效果,
        noMask: 请求结果是否需要mask效果,
        isPopup: 请求结果是否有popup
     }
     */
    var ajaxRequest = function (param) {
        var method = param && param.method || 'GET',
            url = param && param.url || '',
            data = param && param.data || {},
            success = param && param.success,
            error = param && param.error,
            noLoad = !param.noLoad,
            noMask = !param.noMask,
            isPopup = !param.isPopup,
            effect = function () {
                if (noLoad) {
                    $ionicLoading.hide();
                }
                if (isPopup) {
                    backDrop.release();
                }
            };

        if (noMask) {

            $ionicLoading.show({
                template: '<span class="ion-load-d"></span>'
            });

            backDrop.retain();
        }

        $http({
            method: method,
            url: ENV.getDomain() + url + '.json',
            params: /(POST)/ig.test(method) ? null : data,
            data: /(POST)/ig.test(method) ? data : null,
            timeout: 15000,
        }).success(function (data) {
            console.log(data);

            if (typeof success === 'function') {
                success(data);
            }

            effect();

        }).error(function (data) {

            if (typeof error === 'function') {
                error(data);
            }

            effect();

        });

    };

    return {
        backDrop: backDrop,
        safeApply: safeApply,
        stickyTopScroll: stickyTopScroll,
        msgToast: msgToast,
        ajaxRequest: ajaxRequest
    };
});