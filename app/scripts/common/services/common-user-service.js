'use strict';

angular.module('GSH5').factory('$userService', function ($location, ENV) {

    var LOGIN_URL_MAP = {
            waptest: 'https://accounts.fat49.qa.nt.ctripcorp.com/H5Login/#login',
            uat: 'https://accounts.uat.qa.nt.ctripcorp.com/H5Login/#login',
            baolei: 'https://accounts.ctrip.com/H5Login/#login',
            preProduction: 'https://accounts.ctrip.com/H5Login/#login'
        },

        KEY_USERINFO = 'USERINFO';

    (function () {
        var loginInfo = '';
        /* for the cross domain issue when login, we need save userinfo in GS H5 page.
         * login info:
         * var logininfo = {
         *      islogin: 1,
         *      auth: userInfo.Auth,
         *      time: userInfo.ExpiredTime,
         *      isuser: userInfo.isNunUser
         * }
         * var token = encodeURIComponent(cUtilityCrypt.Base64.encode(JSON.stringify(logininfo)));
         *
         * http://m.fat19.qa.nt.ctripcorp.com/webapp/myctrip/index.html? __token__=xxxxxx
         */
        var urlParams = $location.search(),
            token = urlParams.__token__;

        try {
            loginInfo = JSON.parse(window.Base64.decode(decodeURIComponent(token)));
        } catch (e) {
            window.console.log('get logininfo error: ' + e);
        }

        if (!!loginInfo) {
            var userInfo = {
                'timeout': loginInfo.time,
                'data': {
                    'IsNonUser': loginInfo.isuser,
                    'Auth': loginInfo.auth
                }
            };
            window.localStorage.setItem(KEY_USERINFO, JSON.stringify(userInfo));
        }
    })();

    var getLoginURL = function (type, from, backurl) {
        /*
         * dev:开发
         * fat:测试
         * uat,prd:生产
         */

        var url = LOGIN_URL_MAP.preProduction;
        if (window.location.href.indexOf('uat.qa.nt.ctripcorp') > -1) {
            url = LOGIN_URL_MAP.uat;
        } else if (window.location.href.indexOf('localhost:3000') > -1 || window.location.href.indexOf('nt.ctripcorp.com') > -1) {
            url = LOGIN_URL_MAP.waptest;
        } else if (window.location.href.indexOf('10.8.2.111') > -1) {
            url = LOGIN_URL_MAP.baolei;
        }

        url += (from ? ('?from=' + window.encodeURIComponent(from)) : '');
        url += (backurl ? ('&backurl=' + window.encodeURIComponent(backurl)) : '');

        return url;
    };

    var is_weixin = function () {
        var ua = window.navigator.userAgent.toLowerCase();

        if (ua.indexOf('micromessenger') > -1) {
            return true;
        } else {
            return false;
        }
    };

    var webappMemberLogin = function (sourcePath, replace, type) {
        /*
         * type
         * 0: 非会员预定按钮
         * 1: 动态密码登录
         */
        var openId = window.localStorage.wx_openId,
            from = sourcePath || window.location.href,
            loginUrl = '';

        if (openId && is_weixin()) {
            loginUrl = 'http://m.ctrip.com/webapp/myctrip/#account/weixinloginvalidate?ToUserName=love_trips&OpenID=' + openId + '&BackUrl=' + window.encodeURIComponent(from);
        } else {
            loginUrl = getLoginURL(type || 0, sourcePath, sourcePath);
        }

        if (replace) {
            window.location.replace(loginUrl);
        } else {
            window.location.href = loginUrl;
        }

    };

    var appMemberLogin = function (done, fail) {

        app.bridgeCallback.member_login = function (res) {

            if (res && res.param) {

                window.localStorage.setItem('USERINFO', JSON.stringify(res.param));

                if (typeof done === 'function') {
                    done();
                }

            } else {

                if (typeof fail === 'function') {
                    fail();
                }

            }

            app.bridgeCallback.member_login = function () {}; // clear

        };

        app.callBridge('CtripUser', 'app_member_login');

    };

    /*
     * @params { Object } 登录参数
     * @params.sourcePath { String } webappLogin 登录成功返回页面URL
     * @params.replace { boolean } 是否从hitory删除当前页面URL
     * @params.done { Function } native 登录成功后回调方法
     * @params.fail { Function } native 登录失败后回调方法
     */

    var memberLogin = function (params) {

        if (ENV.isHybrid) {
            appMemberLogin(params.done, params.fail);
        } else {
            webappMemberLogin(params.sourcePath, params.replace, params.type);
        }

    };

    var getAuth = function () {

        var auth = '';
        var userInfo = window.localStorage.getItem('USERINFO');

        try {
            userInfo = JSON.parse(userInfo);
        } catch (e) {
            userInfo = '';
        }

        if (userInfo && userInfo.data) {
            auth = userInfo.data.Auth;
        }

        return auth;
    };

    var isLoginExpired = function () {
        var userInfo = window.localStorage.getItem('USERINFO');

        try {
            userInfo = JSON.parse(userInfo);
        } catch (e) {
            return true;
        }

        if (!userInfo || !userInfo.timeout) {
            return true;
        }

        var expireTime = new Date(userInfo.timeout),
            currentTime = new Date();
        if (expireTime.getTime() <= currentTime.getTime()) {
            return true;
        }

        return false;
    };

    var isLogin = function () {
        return !!getAuth();
    };

    var needLogin = function () {
        return !getAuth();
    };

    var getMemberH5Info = function () {
        var infoStr = window.localStorage.getItem('MEMBER_H5_INFO_PARAM');
        if (infoStr) {
            return JSON.parse(infoStr);
        }
        return {};
    };

    var getRequestHead = function () {

        var auth = getAuth() || '08D6399B4FA5913DFCFCC8DC03368E57CDC8FBCD1BA83A62C4E1CF1A27AAD23E';
        // var auth = '08D6399B4FA5913DFCFCC8DC03368E57CDC8FBCD1BA83A62C4E1CF1A27AAD23E';

        if (ENV.isHybrid) {
            var memberH5Info = getMemberH5Info();
            return {
                'syscode': memberH5Info.systemCode || '',
                'lang': '01',
                'auth': auth,
                'cid': memberH5Info.clientID || '',
                'cver': memberH5Info.version || ''
            };
        } else {
            return {
                'syscode': '09',
                'lang': '01',
                'auth': auth,
                'cver': '1.0'
            };
        }
    };

    return {
        memberLogin: memberLogin, //跳转登陆页
        getAuth: getAuth, // 获取当前auth，如果没有则为空
        isLoginExpired: isLoginExpired, //判断auth过期
        isLogin: isLogin, //判断是否已登录
        needLogin: needLogin, //判断是否需要登录
        getRequestHead: getRequestHead //获取请求头部信息
    };

});
