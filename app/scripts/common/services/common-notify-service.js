'use strict';

angular.module('EPBUY').factory('Notification', function ($timeout, $compile) {

    var notificationTimer, tpl;
    var notify = function (scope, msg) {
        if (!tpl) {
            tpl = $compile('<div class="notifier" ng-if="notification"><span>{{notification}}</span></div>');
            angular.element(window.document.getElementsByTagName('ion-nav-view')[0]).append(tpl(scope));
        }

        scope.notification = msg;

        $timeout.cancel(notificationTimer);
        notificationTimer = $timeout(function () {
            scope.notification = '';
            $timeout.cancel(notificationTimer);
        }, 2000);
    };

    return {
        notify: notify
    };
});
