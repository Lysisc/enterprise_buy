'use strict';

angular.module('EPBUY').factory('ENV', function () {

    /**
     * 'local': 本地环境
     * 'server': 服务器环境
     */
    var reservedMode = [
        'local',
        'server'
    ];

    var domainMap = {
        // todo: use gateway domain with service code.
        local: '/api/',
        server: '/dist/api/'
    };

    var domainOnlyMap = {
        local: '/api/',
        server: '/dist/api/'
    };

    /*
     * '0': 本地环境
     * '1': 服务器环境
     */
    var hybridEnvMap = {
        '0': 'local',
        '1': 'server'
    };

    var defaultMode = 'server';

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

                if (l.indexOf('http://www.51mart.com.cn/') > -1) {
                    mode = 'server';
                } else if (l.indexOf('localhost:3001') > -1 || l.indexOf('localhost:3000') > -1) {
                    mode = 'local';
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
