'use strict';

angular.module('GSH5')
  .directive('fallbackSrc', function (ENV) {
    return {
      link: function (scope, iElement, iAttrs) {
        var src = ENV.staticResourceUrl + iAttrs.fallbackSrc;
        scope.fallbackSrc = src;
        iElement.bind('error', function () {
          if(iAttrs.fallbackSrc) {
            angular.element(this).attr('src', src);
            iAttrs.fallbackSrc = null;
          }
        });
      }
    };

  });

