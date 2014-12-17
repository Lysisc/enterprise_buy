'use strict';

angular.module('EPBUY')

/**
 * Sets focus to this element if the value of focus-me is true.
 * @example
 *  <a ng-click="addName=true">add name</a>
 *  <input ng-show="addName" type="text" ng-model="name" focus-me="{{addName}}" />
 */
.directive('focusMe', function ($timeout) {
    return {
        scope: {
            trigger: '@focusMe'
        },
        link: function (scope, element) {
            scope.$watch('trigger', function (value) {
                if (value === 'true') {
                    $timeout(function () {
                        element[0].focus();
                    });
                }
            });
        }
    };
});