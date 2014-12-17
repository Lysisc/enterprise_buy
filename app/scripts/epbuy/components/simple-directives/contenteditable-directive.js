'use strict';

angular.module('EPBUY')

/**
 * Two-way data binding for contenteditable elements with ng-model.
 * @example
 *   <p contenteditable="true" ng-model="text"></p>
 */
.directive('contenteditable', function () {
    return {
        require: '?ngModel',
        link: function (scope, element, attrs, ctrl) {

            // Do nothing if this is not bound to a model
            if (!ctrl) {
                return;
            }

            element.on('focus', function (e) {
                var text = angular.element(e.target);
                if (text.text() === '备注要求') {
                    text.text('');
                }
            });

            element.on('blur', function (e) {
                var text = angular.element(e.target);
                if (text.text() === '') {
                    text.text('备注要求');
                }
            });

            // Checks for updates (input or pressing ENTER)
            // view -> model
            element.on('input', function () {
                var html = element.html();

                html = html.replace(/<div>/g, '').replace(/<br>/g, '').replace(/<\/div>/g, '');

                scope.$apply(function () {
                    ctrl.$setViewValue(html);
                    ctrl.$render();
                });
            });

            element.on('keyup', function (e) {
                if (e.keyCode === 13) {
                    console.log(scope.remark);
                    return false;
                }
            });

            // model -> view
            ctrl.$render = function () {
                element.html(ctrl.$viewValue);
            };

            // load init value from DOM
            ctrl.$render();
        }
    };
});