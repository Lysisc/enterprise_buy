'use strict';

angular.module('EPBUY').factory('ENV', function ($timeout) {

    var isIosDev = !! navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isIosDev) {
        document.getElementById('wrap').className = 'is-ios';
    }

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
                ENV.platform = ENV.platform.replace('iOS', 'IOS');
            }

        } else {
            timer++;
            $timeout(getDevice, 1000);
        }

    };

    $timeout(getDevice, 1000);

    return ENV;

});
