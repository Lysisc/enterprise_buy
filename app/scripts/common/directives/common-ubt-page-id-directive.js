'use strict';

(function () {

  /**
   * attribute directive for ubt page id
   * 
   * 依赖 common/services/common-ubt-service.js 提供的 $ubt service
   * 如果页面中需要动态改变 page id，仍可以调用 $ubt service 提供的方法
   * 直接在模板中添加含有 ubt-page-id 的标签即可，例如
   * 
   * <input type="hidden" ubt-page-id data-hybrid-page-id="10010" data-browser-page-id="95588">
   * browser page id: 10086, hybrid page id: 95555 
   *
   * 标签没有限制，需要统计得页面，需要加一个标签
   * 
   * 必需属性: ubt-page-id
   * 可选: data-hybrid-page-id
   * 可选: data-browser-page-id
   */

  angular.module('GSH5').directive('ubtPageId', function ($ubt) {

    var directive = {};

    directive.restrict = 'A';

    directive.link = function (scope, iElement, iAttrs) {
      var hybridPageId = iAttrs.hybridPageId || 0;
      var browserPageId = iAttrs.browserPageId || 0;

      if (hybridPageId || browserPageId) {
        $ubt.setPageId({
          hybrid: hybridPageId,
          browser: browserPageId
        });

        $ubt.send();
      }
    };

    return directive;

  });

})();
