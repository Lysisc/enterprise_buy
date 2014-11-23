'use strict';

angular.module('EPBUY').factory('ENV', function () {

    /**
     * 'waptest': 测试
     * 'uat': UAT,
     * 'baolei': 堡垒,
     * 'preProduction': 生产
     */
    var reservedMode = [
        'waptest',
        'uat',
        'baolei',
        'preProduction'
    ];

    var domainMap = {
        // todo: use gateway domain with service code.
        // waptest: 'http://ws.you.fat61.qa.nt.ctripcorp.com/mobilefood',
        waptest: '/api',
        uat: 'http://gateway.m.uat.qa.nt.ctripcorp.com/restapi/soa2/10332',
        baolei: 'http://m.ctrip.com/restapi/soa2/10332',
        preProduction: 'http://m.ctrip.com/restapi/soa2/10332'
    };

    var domainOnlyMap = {
        waptest: 'http://gateway.m.fws.qa.nt.ctripcorp.com/restapi',
        uat: 'http://gateway.m.uat.qa.nt.ctripcorp.com/restapi',
        baolei: 'http://m.ctrip.com/restapi',
        preProduction: 'http://m.ctrip.com'
    };

    /*
     * '0': 测试
     * '1': 堡垒
     * '2': UAT
     * 其他: 生产
     */
    var hybridEnvMap = {
        '0': 'waptest',
        '1': 'baolei',
        '2': 'uat'
    };

    var isHybrid = /ctripwireless/.test(window.navigator.userAgent.toLowerCase());
    var isBrowser = !isHybrid;
    var defaultMode = 'preProduction';

    var ENV = (function () {

        return {

            mode: '',

            staticResourceUrl: '',

            /**
             * 初始化 Env Mode
             */
            initMode: function () {
                // default env mode
                var mode = defaultMode;
                var l = window.location.href;

                if (isHybrid) {
                    var isPreProduction = window.Env.isPreProduction;

                    if (hybridEnvMap[isPreProduction]) {
                        mode = hybridEnvMap[isPreProduction];
                    }

                } else {

                    if (l.indexOf('uat.qa.nt.ctripcorp') > -1) {
                        mode = 'uat';
                        // } else if (l.indexOf(':3000') > -1 || l.indexOf('nt.ctripcorp.com') > -1) {
                    } else if (l.indexOf('localhost:3000') > -1 || l.indexOf('nt.ctripcorp.com') > -1) {
                        mode = 'waptest';
                    } else if (l.indexOf('10.8.2.111') > -1) {
                        mode = 'baolei';
                    }

                }

                this.mode = mode;
            },

            /**
             * 动态改变当前 Env Mode
             * @param {string} mode reservedMode 中的一个
             */
            setMode: function (mode) {
                mode = mode.toString() || defaultMode;

                if (reservedMode.indexOf(mode) > -1) {
                    this.mode = mode;
                }
            },

            /**
             * 获取当前 Env Mode
             * @return {string} reservedMode 中的一个
             */
            getMode: function () {
                if (!this.mode) {
                    this.initMode();
                }
                return this.mode || defaultMode;
            },

            /**
             * 获取当前 API Domain 前缀
             * @return {string} domainMap 中的一个
             */
            getDomain: function () {
                return domainMap[this.getMode()];
            },

            getDomainOnly: function () {
                return domainOnlyMap[this.getMode()];
            },

            setStaticResourceUrl: function () {

            },

            init: function () {

                // this.initMode();

                return this;

            }

        };

    })().init();

    /**
     * ENV 实例
     */
    return {
        /**
         * 成员
         * ENV Mode, reservedMode 中的一个
         * @type {string}
         */
        mode: ENV.mode,

        /**
         * 成员
         * 静态资源 URL, 本地为相对路径, 测试环境或生产环境下为绝对路径 URL
         * @type {string}
         */
        staticResourceUrl: ENV.staticResourceUrl,

        /**
         * 成员
         * true: 在携程 App 环境中
         * @type {Boolean}
         */
        isHybrid: isHybrid,

        /**
         * 成员
         * true: 不在携程 App 环境中
         * @type {Boolean}
         */
        isBrowser: isBrowser,

        initMode: ENV.initMode,

        /**
         * 方法
         * 动态改变当前 Env Mode
         * @param {string} mode reservedMode 中的一个
         * @return {void}
         */
        setMode: ENV.setMode,

        /**
         * 方法
         * 获取当前 Env Mode
         * @param  不需要
         * @return {string} reservedMode 中的一个
         */
        getMode: ENV.getMode,

        /**
         * 方法
         * 获取当前 API Domain 前缀
         * @param  不需要
         * @return {string} domainMap 中的一个
         */
        getDomain: ENV.getDomain,

        /**
         * 方法
         * 获取当前 API Domain 前缀
         * @param  不需要
         * @return {string} domainOnlyMap 中的一个
         */
        getDomainOnly: ENV.getDomainOnly
    };
});