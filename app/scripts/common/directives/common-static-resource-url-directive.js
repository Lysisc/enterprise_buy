'use strict';

(function () {

    /**
     * attribute directive for static resource url
     *
     * 依赖 ENV service
     *
     * index.html 中添加了
     * <input type="hidden" data-static-resource-url="">
     *
     * 用于指定再不同环境中的静态资源文件 URL 前缀
     * 本地环境 data-static-resource-url="" 留空即可
     * 测试及生产环境 data-static-resource-url 会被定义为静态资源的绝对 URL 地址
     *
     * 必需属性: data-static-resource-url
     */

    angular.module('EPBUY').directive('staticResourceUrl', function (ENV) {

        var directive = {};

        directive.restrict = 'A';

        directive.link = function (scope, iElement, iAttrs) {
            ENV.staticResourceUrl = iAttrs.staticResourceUrl || '';
        };

        return directive;

    });

})();
