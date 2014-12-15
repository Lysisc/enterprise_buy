'use strict';

angular.module('EPBUY').factory('DataCachePool', function () {
    var ONE_DAY = 24 * 3600 * 1000;

    var fetchItem = function (key) {
        if (!key) {
            return null;
        }

        var itemStr = localStorage.getItem('EPBUY_' + key),
            item;
        try {
            item = JSON.parse(itemStr);
        } catch (e) {}
        if (!item || !Array.isArray(item)) {
            return null;
        }
        return item;
    };

    var pushData = function (key, dataKey, data) {
        if (!key || !dataKey || !data) {
            return;
        }

        var item = fetchItem(key),
            obj = {
                expired: Date.now() + ONE_DAY
            };
        obj[dataKey] = data;
        if (!item) {
            item = [obj];
        } else {
            item.unshift(obj);
            if (item.length > 10) { // 尺寸控制在10以内，并遵循先进先出原则
                item.pop();
            }
        }
        localStorage.setItem('EPBUY_' + key, JSON.stringify(item));
    };

    var fetchData = function (key, dataKey) {
        var item = fetchItem(key),
            data;
        if (!item || !dataKey) {
            return null;
        }

        for (var i = 0, len = item.length; i < len; i++) {
            if (item[i][dataKey]) {
                if (item[i].expired >= Date.now()) { // 检查数据是否已过期
                    data = item[i][dataKey];
                }
                break;
            }
        }
        return data;
    };

    return {
        push: pushData,
        fetch: fetchData
    };
});
