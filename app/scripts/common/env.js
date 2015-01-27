'use strict';

angular.module('EPBUY').factory('ENV', function ($timeout) {

    var ENV = {
        iosVersion: '1.0.0',
        androidVersion: '1.0.0',
        platform: 'Browser',
        isHybrid: false,
        getLocalApi: '/api/',
        getServerApi: 'http://www.51mart.com.cn/Service/api/'
    };

    var timer = 0;

    var getDevice = function () {
        if (timer > 3) {
            return;
        }

        if (window.device) {

            ENV.isHybrid = !!window.device.platform;
            ENV.platform = window.device.platform;

            if (ENV.platform === 'iOS') {
                ENV.platform = 'IOS';
                document.getElementById('wrap').className = 'is-ios';
            }

        } else {
            timer++;
            $timeout(getDevice, 500);
        }

    };

    $timeout(getDevice, 500);

    return ENV;

});
