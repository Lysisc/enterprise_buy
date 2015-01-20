'use strict';

// var isHybrid = !!navigator.userAgent.match(/AppleWebKit.*Mobile.*/) || !!navigator.userAgent.match(/AppleWebKit/);
var isHybrid = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
if (isHybrid) {
    document.getElementById('wrap').className = 'is-hybird';
}

// var iosVersion = navigator.userAgent.match(/OS \d+/i);
// if (iosVersion) {
//     iosVersion = iosVersion[0].replace('OS ', '');
//     iosVersion = parseInt(iosVersion, 0);
//     if (iosVersion > 6) {
//         document.getElementById('wrap').className = 'is-hybird';
//     }
// }

angular.module('EPBUY').factory('ENV', function () {

    var ENV = (function () {

        var u = navigator.userAgent,
            app = navigator.appVersion;

        return {
            getLocalApi: '/api/',
            getServerApi: 'http://www.51mart.com.cn/Service/api/',

            mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
        };

    })();

    return {
        getLocalApi: ENV.getLocalApi,
        getServerApi: ENV.getServerApi, //取服务器接口domain
        isHybrid: ENV.mobile //是否为移动终端
    };

});
