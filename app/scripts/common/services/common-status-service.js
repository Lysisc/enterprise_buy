'use strict';

angular.module('EPBUY').factory('pageStatus', function ($location, $state) {

    /*
     * 调用方式：引入pageStatus和$scope, $compile, $stateParams依赖参数;
     * 在页面controller里声明 pageStatus.pageStatusInit($scope, $compile, $stateParams);
     * 如果页面初次加载需要遮罩，请在ion-view标签上加一个ng-show="hasResult"属性来控制页面隐藏；
     * 请求成功时调用loadSuccess方法;
     * 请求失败时网络报错，调用loadError方法;
     */

    var pageStatusInit = function (scope, compile, stateParams) { //初始化页面

        var isLoadingTpl = compile('<div class="backdrop visible active" ng-show="isLoading"><div class="loading"><span class="logo-white"><i class="loading-ring"></i></span></div></div>'),
            noNetworkTpl = compile('<div class="no-network" ng-show="isNoNetwork"><i class="icon-no-network"></i><div>数据加载失败，请检查是否联网</div><span ng-click="refreshPage();">重新加载</span></div>'),
            noResultTpl = compile('<div class="no-result" ng-show="isNoResult"><i class="icon-search"></i><div>该地区暂无数据，敬请期待。</div></div>'),
            angularBox = angular.element(window.document.getElementsByTagName('ion-nav-view')[0]),
            goBackBtn = angular.element(window.document.getElementsByTagName('ion-nav-back-button')[0]),
            removeDom = function () {
                angular.element(window.document.querySelector('.isLoading')).remove();
                angular.element(window.document.querySelector('.no-network')).remove();
                angular.element(window.document.querySelector('.no-result')).remove();
            },
            hashVal = $location.$$url;

        goBackBtn.bind('click', function () {
            removeDom();
        });

        scope.$on('$locationChangeStart', function () { //切换页面时清除dom
            removeDom();
        });

        scope.refreshPage = function () { //刷新页面
            var current = $state.current;
            var params = angular.copy(stateParams);
            $state.transitionTo(current, params, {
                reload: true,
                inherit: true,
                notify: true
            });
        };

        return {

            loading: function (hasResult) { //启动loading
                angularBox.append(isLoadingTpl(scope));
                scope.hasResult = (hasResult !== false);
                scope.isLoading = true;
                scope.isNoNetwork = false;
                scope.isNoResult = false;
            },

            loadSuccess: function () { //拿到res后加载页面
                scope.isLoading = false;
                scope.hasResult = true;
            },

            loadError: function (showError) { //网络错误
                scope.isLoading = false;
                if (showError && $location.$$url === hashVal) {
                    angularBox.append(noNetworkTpl(scope));
                }
                scope.isNoNetwork = true;
            },

            noResult: function () { //请求无结果
                scope.isLoading = false;
                if ($location.$$url === hashVal) {
                    angularBox.append(noResultTpl(scope));
                }
                scope.isNoResult = true;
            }

        };

    };

    return {
        pageStatusInit: pageStatusInit
    };

});