'use strict';

angular.module('EPBUY').factory('Util', function ($http, $rootScope, $state, $compile, $ionicPopup, $ionicLoading, $timeout) {

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

    $rootScope.$on('$locationChangeStart', function () { //切换页面时隐藏分享条
        angular.element(document.getElementById('shareBtnCtrl')).css('display', 'none');
    });

    /**
     * toast提示层
     * @param msg, time
     */
    var toastTimer = null;
    var msgToast = function (msg, time) {
        var toastDom = angular.element(document.querySelector('.notifier'));

        if (!toastDom.length) {
            var toastTpl = $compile('<div class="notifier" ng-click="notification=null" ng-show="notification"><span>{{notification}}</span></div>');
            angular.element(document.getElementsByTagName('ion-nav-view')[0]).append(toastTpl($rootScope));
        }

        $timeout(function () {
            $rootScope.notification = msg;
        });

        $timeout.cancel(toastTimer);

        toastTimer = $timeout(function () {
            $rootScope.notification = '';
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
     * 重写angular的param方法，使angular使用jquery一样的数据序列化方式  The workhorse; converts an object to x-www-form-urlencoded serialization.
     * @param {Object} obj
     * @return {String}
     */
    var paramObj = function (obj) {
        var query = '',
            name, value, fullSubName, subName, subValue, innerObj, i;

        for (name in obj) {
            value = obj[name];

            if (value instanceof Array) {
                for (i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += paramObj(innerObj) + '&';
                }
            } else if (value instanceof Object) {
                for (subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += paramObj(innerObj) + '&';
                }
            } else if (value !== undefined && value !== null) {
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }
        }

        return query.length ? query.substr(0, query.length - 1) : query;
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
        isPopup: 请求结果是否有popup,
        isForm: 请求形式改为形式，增加param方法来封装postData
     }
     */
    var loginPopupTimer = null;
    var ajaxRequest = function (param) {
        if (!param) {
            return;
        }

        var data = param.data || {},
            success = param.success,
            error = param.error,
            noLoad = !param.noLoad,
            noMask = !param.noMask,
            isPopup = !param.isPopup,
            isForm = param.isForm,
            configObj = {
                method: param.method || 'GET',
                url: param.url || '',
                params: /POST/ig.test(param.method) ? null : data,
                data: /POST/ig.test(param.method) ? (isForm ? paramObj(data) : data) : null,
                timeout: 15000,
            },
            effect = function () {
                if (noLoad) {
                    $ionicLoading.hide();
                }
                if (isPopup) {
                    backDrop.release();
                }
            };

        if (isForm) {
            configObj.headers = {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            };
        }

        if (noMask) {

            $ionicLoading.show({
                template: '<span class="ion-load-d"></span>'
            });

            backDrop.retain();
        }

        $http(configObj).success(function (data) {
            if (data && data.state === -200) { //判断登录
                $ionicLoading.hide();
                $timeout.cancel(loginPopupTimer);
                loginPopupTimer = $timeout(function () {
                    $ionicPopup.alert({
                        template: '请重新登录',
                        buttons: [{
                            text: '知道了',
                            type: 'button-positive',
                            onTap: function () {
                                localStorage.removeItem('EPBUY_USERAUTH');
                                $state.go('epbuy.login', {
                                    OtherPage: 1
                                });
                            }
                        }]
                    });
                }, 100);
                return;
            }

            if (data && typeof success === 'function') {
                success(data);
            }

            effect();

        }).error(function (data) {

            if (typeof error === 'function') {
                error(data);
            } else {
                msgToast('请检查你的网络');
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
