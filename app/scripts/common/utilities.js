'use strict';

//公有方法
angular.module('EPBUY').factory('Util', function ($rootScope, $http, $state, $compile, $ionicBackdrop, $ionicLoading, $timeout, ENV) {

    //重写$ionicBackdrop.release();效果
    var backDrop = function (status) {
        var backDropDom = angular.element(document.querySelector('.backdrop'));
        if (status && backDropDom) {
            $timeout(function () {
                backDropDom.addClass('visible');
            }, 100);
        } else {
            $timeout(function () {
                backDropDom.removeClass('visible');
            }, 100);
        }
    };

    var toastTimer = null,
        toastTpl = null;

    $rootScope.$on('$locationChangeStart', function () { //切换页面时清除dom
        backDrop();
        toastTpl = null;
    });

    /**
     * toast提示层
     * @param scope, msg, time
     */
    var msgToast = function (scope, msg, time) {

        if (!toastTpl) {
            toastTpl = $compile('<div class="notifier" ng-if="notification"><span>{{notification}}</span></div>');
            angular.element(window.document.getElementsByTagName('ion-nav-view')[0]).append(toastTpl(scope));
        }

        scope.notification = msg;

        $timeout.cancel(toastTimer);

        toastTimer = $timeout(function () {
            scope.notification = '';
            $timeout.cancel(toastTimer);
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
    var stickyTopScroll = function (scope, titleEles, handler) {
        if (!scope || !titleEles || !titleEles.length || !handler || !handler.getScrollPosition()) {
            return;
        }

        var titleEle, height, targetEle, sticker,
            scrollTop = handler.getScrollPosition().top;

        if (scope.stickyContent === undefined) {
            var tpl = $compile('<h2 class="sticker" ng-if="stickyContent != null">{{stickyContent}}</h2>');
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

    /**
     * ajax请求
     * @param param
     */
    var ajaxRequest = function (param) {
        var method = param && param.method || 'GET',
            url = param && param.url || '',
            success = param && param.success,
            error = param && param.error,
            effect = param && param.effect,
            postData = param && param.data || {};

        if (effect !== 'false') {
            $ionicBackdrop.retain();
            $ionicLoading.show({
                template: '<span style="color:red;">loading...</span>'
            });
        }

        $http({
            method: method,
            url: ENV.getDomain() + url,
            data: postData
        }).success(function (data) {
            console.log(data);

            $ionicBackdrop.release();
            $ionicLoading.hide();

            if (typeof success === 'function') {
                success(data);
            }

        }).error(function (data) {

            $ionicBackdrop.release();
            $ionicLoading.hide();

            //todo... 判断错误信息
            if (typeof error === 'function') {
                error(data);
            } else {
                console.log('网络问题请重试');
            }

        });

    };

    return {
        safeApply: safeApply,
        stickyTopScroll: stickyTopScroll,
        formatRestaurantName: formatRestaurantName,
        msgToast: msgToast,
        ajaxRequest: ajaxRequest
    };
});

//公有工具
angular.module('EPBUY')
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