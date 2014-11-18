/**
 * 获取当前位置的详细信息, district id, poi id, distrit name 信息
 * 依赖于服务: $geo
 * path: ./common-geo-service.js
 *
 * 引入 service 后
 $geo.getInfo(function (resp) {
      resp.cityId: 当前城市Id
      resp.cityName: 当前城市名称
      resp.address: 当前地址
      resp.lat: 纬度
      resp.lon: 经度
    }, function () {
      type: locate: 定位失败
            api: 接口挂了
    });

 */

'use strict';

angular.module('EPBUY').factory('$geo', ['$http', '$locate', '$timeout', function ($http, $locate, $timeout) {

    var cachedPosition, TIME_OUT = 2000,

        /**
         * Google GEO api解析器
         * @param respObj
         * @returns {{}}
         */
        parseGoogleGeoInfo = function (respObj) {
            var geoInfo = {};

            try {
                geoInfo.address = respObj.results[0].formatted_address.split(' ')[0];

                var addressComponents = respObj.results[0].address_components,
                    addressComponent,
                    i, j, len, len2;

                for (i = 0, len = addressComponents.length; i < len; i++) {
                    addressComponent = addressComponents[i];
                    for (j = 0, len2 = addressComponent.types.length; j < len2; j++) {
                        if (addressComponent.types[j] === 'locality') {
                            break;
                        }
                    }
                    if (j < len2) {
                        geoInfo.cityName = addressComponent.short_name || addressComponent.long_name;
                    }
                }
            } catch (e) {}

            return geoInfo;
        },

        services = [{
            url: 'http://maps.google.cn/maps/api/geocode/json?latlng=:lat,:lon&language=zh-CN&sensor=false',
            parser: parseGoogleGeoInfo
        }, {
            url: 'http://maps.google.com/maps/api/geocode/json?latlng=:lat,:lon&language=zh-CN&sensor=false',
            parser: parseGoogleGeoInfo
        }],

        /**
         * 从第三方service抓取GEO信息
         * @param service -- 第三方service address
         * @param parser -- 响应结果解析器，将结果解析成指定的格式
         * @param callback
         */
        fetchGeoInfo = function (service, parser, callback) {
            if (!service || !parser) {
                callback(false);
                return;
            }

            $http.get(service).success(function (respObj) {
                callback(true, parser(respObj));
            }).error(function () {
                callback(false);
            });
        },

        /**
         * 根据城市名称查询城市ID
         * @param cityName
         * @param callback
         */
        fetchCityIdViaName = function (cityName, callback) {
            $http.get('http://m.ctrip.com/restapi/you/SearchApi/GetLenovo?pageindex=1&pagesize=1&searchtype=1&keyword=' + cityName).success(function (respObj) {
                if (respObj && respObj.districts && respObj.districts.length > 0) {
                    callback(true, respObj.districts[0].Id);
                } else {
                    callback(false);
                }
            }).error(function () {
                callback(false);
            });
        },

        getDistrictViaApi = function (location, callback) {
            var calledFlag = false,
                fetchGeoInfoCallback = function (isSucc, geoInfo) {
                    if (calledFlag) {
                        return;
                    }
                    calledFlag = true;

                    if (isSucc) {
                        fetchCityIdViaName(geoInfo.cityName, function (_isSucc, cityId) {
                            if (_isSucc) {
                                geoInfo.cityId = cityId;
                                angular.extend(geoInfo, location);
                                cachedPosition = geoInfo;
                                callback(true, geoInfo);
                            } else {
                                callback(false);
                            }
                        });
                    } else {
                        callback(false);
                    }
                };

            for (var i = 0, len = services.length; i < len; i++) {
                var service = services[i].url.replace(':lat', location.lat).replace(':lon', location.lon);
                fetchGeoInfo(service, services[i].parser, fetchGeoInfoCallback);
            }
        };

    return {
        /**
         * 获取当前位置的详细信息
         * @param  {function} runtimeDone   可选: 获取成功后执行的回调函数, 详细信息作为参数
         * @param  {function} runtimeFail   可选: 获取失败后执行的回调函数, 失败类型作为参数
         * @param  {object}   options
         *                    options.refresh {boolean} true: 强制刷新
         * @return void
         */
        getInfo: function (runtimeDone, runtimeFail, options) {
            options = options || {};

            if (cachedPosition && !options.refresh) {
                runtimeDone(cachedPosition);

            } else {
                var calledFlag = false,
                    callback = function (isSucc, geoInfo) {
                        if (calledFlag) {
                            return;
                        }
                        calledFlag = true;

                        if (isSucc) {
                            if (typeof runtimeDone === 'function') {
                                runtimeDone(geoInfo);
                            }
                        } else if (typeof runtimeFail === 'function') {
                            runtimeFail();
                        }
                    };

                $locate.getPosition(function (args) {
                    getDistrictViaApi(args, callback);
                }, function () {
                    callback(false);
                });
                // 超时处理(如果是强制刷新，则不做超时控制)
                if (!options.refresh) {
                    $timeout(function () {
                        callback(false);
                    }, TIME_OUT);
                }
            }
        }
    };
}]);
