'use strict';

angular.module('EPBUY').factory('ENV', function ($timeout) {

    var ua = navigator.userAgent.toLowerCase();

    var ENV = {
        getLocalApi: '/api/',
        getServerApi: 'http://www.51mart.com.cn/Service/api/',

        iosVersion: '1.1.0',
        androidVersion: '1.1.0',
        platform: 'Browser',
        isHybrid: false, //-----是否APP环境
        isWeixin: false, //-----是否微信环境
        isApple: false, //------是否苹果环境
        isAndroid: false //-----是否Android环境
    };

    if (isHybridCreatePhoneApp) { //--是否APP环境
        ENV.isHybrid = true;
    }

    if (ENV.isHybrid && /android/.test(ua)) { //--是否安卓环境
        ENV.isAndroid = true;
        ENV.platform = 'Android';
    }

    if (ENV.isHybrid && /iphone|ipad|ipod/.test(ua)) { //--是否苹果环境
        ENV.isApple = true;
        ENV.platform = 'IOS';
        document.getElementById('wrap').className = 'is-ios';
    }

    if (/micromessenger/.test(ua)) { //--是否微信环境
        ENV.isWeixin = true;
        ENV.platform = 'WeChat';
    }

    return ENV;

});
