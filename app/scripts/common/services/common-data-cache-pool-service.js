'use strict';

angular.module('EPBUY').factory('DataCachePool', function () {

    var fetchItem = function (key) {
        if (!key) {
            return null;
        }

        var itemStr = localStorage.getItem('EPBUY_' + key),
            item;

        try {
            item = JSON.parse(itemStr);
        } catch (e) {}

        if (!item) {
            return null;
        }
        return item;
    };

    var ONE_DAY = 24 * 3600 * 1000;

    /**
     * 设置本地存储的值
     * @param key 本地存储name
     * @param dataObj 本地存储对象，可以包含属性，如果是非object，则直接赋值给value属性，否则取对象属性
     * @param expires 是否加过期时间限制
     */
    var pushData = function (key, dataObj, expires) {
        if (!key || !dataObj) {
            return;
        }

        var item = fetchItem(key) || {},
            dataKey = 'value';

        if (typeof dataObj === 'object' && !angular.isArray(dataObj)) {
            dataKey = dataObj.DataKey ? dataObj.DataKey : 'value';
            item[dataKey] = dataObj.Data || undefined;
        } else {
            item[dataKey] = dataObj || undefined;
        }

        item.expired = expires ? (Date.now() + ONE_DAY * expires) : undefined;

        localStorage.setItem('EPBUY_' + key, JSON.stringify(item));
    };

    /**
     * 获取本地存储的值
     * @param key 本地存储name
     * @param dataKey 本地存储name中的属性name
     * expired如果存在，则判断是否过期，不存在就是永久值
     */
    var pullData = function (key, dataKey) {
        var item = fetchItem(key),
            data;

        if (!item || item.expired && item.expired <= Date.now()) {
            return null;
        } else {
            data = item[dataKey || 'value'];
        }

        return data;
    };

    var removeData = function (key, dataKey) {
        if (!key) {
            return;
        }

        var item = fetchItem(key);

        if (!item) {
            localStorage.removeItem('EPBUY_' + key);
            return;
        }

        if (dataKey && item[dataKey]) {
            item[dataKey] = undefined;
            localStorage.setItem('EPBUY_' + key, JSON.stringify(item));
        } else {
            localStorage.removeItem('EPBUY_' + key);
        }

    };

    return {
        push: pushData,
        pull: pullData,
        remove: removeData,
    };
});