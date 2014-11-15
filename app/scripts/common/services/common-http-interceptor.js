/**
 * $http interceptor
 *
 * 1. 如果 $http 发起 request 的 URL domain 部分是以 $api 开头, 则会被自动替换为当前环境的 domain
 *
 * 例: $http.get('$api/10318/GetDistrictByGeo.json')
 * 可能会被替换成: $http.get('http://m.ctrip.com/restapi/soa2/10318/GetDistrictByGeo.json')
 *
 * 2. SOA 2.0 返回的 response 默认会包含类似如下的属性
 *
   "ResponseStatus": {
    "Timestamp": "\/Date(1408092846011+0800)\/",
    "Ack": "Success",
    "Errors": [],
    "Version": "1.0",
    "Extension": [{
      "Id": "CLOGGING_TRACE_ID",
      "Value": "8072178233082231949"
    }]
  }
 *
 * 如果 ResponseStatus.Ack !== 'Success'，则认为接口获取数据失败
 */

'use strict';

angular.module('GSH5').config(function ($provide, $httpProvider) {

  $provide.factory('gsHttpInterceptor', function ($q, ENV) {

    var gsHttpInterceptor = {

      request: function (config) {
        var raw = config.url;

        if (raw.indexOf('$api') === 0) {
          config.url = raw.replace('$api', ENV.getDomain());
        }

        if (raw.indexOf('$static') === 0) {
          config.url = raw.replace('$static', ENV.staticResourceUrl);
        }

        return config || $q.when(config);
      },

      requestError: function (rejection) {
        return $q.reject(rejection);
      },

      response: function (response) {

        if (response.data && response.data.ResponseStatus) {

          if (response.data.ResponseStatus.Ack !== 'Success') {

            return $q.reject(response);
          }
        }

        return response || $q.when(response);
      },

      responseError: function (rejection) {
        return $q.reject(rejection);
      }
    };

    return gsHttpInterceptor;
  });

  $httpProvider.interceptors.push('gsHttpInterceptor');
});
