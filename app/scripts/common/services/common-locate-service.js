/**
 * 获取当前经纬度 Hybrid && Mobile Broswer
 * 主要方法: @getPosition, 见注释
 *
 * 引入 service 后
    $locate.getPosition(function (args) {
      console.log(args);
      // args.lat: 纬度
      // args.lon: 经度
    }, function () {
      console.log('locate failed');
    }, 'GS_FOODS_CURRENTPOSITION');
 */

'use strict';

angular.module('GSH5').factory('$locate', function (ENV) {

  var locateService = {

    localStorageKey: '',

    done: function () {},

    fail: function () {},

    /**
     * $locate.getPosition()
     * @param  {function} runtimeDone   必需: 定位成功后执行的回调函数, 经纬度作为参数
     * @param  {function} runtimeFail   推荐: 定位失败执行的回调函数
     * @param  {string} localStorageKey 可选: 设置可存储定位的经纬度, 下一次无需定位
     * @return void
     */
    getPosition: function (runtimeDone, runtimeFail, localStorageKey) {
      var self = this;
      var localStoragePos;

      this.done = function (args) {
        if (typeof runtimeDone === 'function') {
          if (self.localStorageKey) {
            self.setStoragePosition(args);
          }
          runtimeDone(args);
        }
      };

      this.fail = function () {
        if (typeof runtimeFail === 'function') {
          runtimeFail();
        }
      };

      if (localStorageKey) {

        this.localStorageKey = localStorageKey;
        localStoragePos = this.getStoragePosition();

        if (localStoragePos) {

          this.done(localStoragePos);

        } else {

          this.doLocate();
        }

      } else {

        this.doLocate();

      }

    },

    doLocate: function () {
      if (ENV.isHybrid) {
        this.nativeLocate();
      } else {
        this.webLocate();
      }
    },

    nativeLocate: function () {

      var self = this;

      // 定位完成会有 2 次 callback，
      // 第一次返回经纬度信息(5.8加入，使用定位缓存的时候，不回掉该结果，直接回掉逆地址解析的数据)，
      // 第二次返回逆地址解析的信息
      window.app.bridgeCallback.locate = function (res) {
        if (!!res && !!res.param && !!res.param.value) {
          // prevent 2nd callback
          if (!res.param.value.addrs) {
            self.nativeLocateDone(res.param.value);
          }
        }
      };

      window.app.callBridge('CtripMap', 'app_locate', true);

    },

    webLocate: function() {

      var self = this;
      var geolocation = window.navigator.geolocation;

      var options = {
        timeout: 5000
      };

      if (geolocation) {

        geolocation.getCurrentPosition(function (position) {
          self.webLocateDone(position);
        }, function () {
          self.webLocateFail();
        }, options);

      } else {
        this.webLocateFail();
      }

    },

    nativeLocateDone: function (value) {
      var args = {
        lat: value.lat,
        lon: value.lng
      };

      this.done(args);
    },

    nativeLocateFail: function () {
      this.fail();
    },

    webLocateDone: function (position) {

      var args = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
      };

      this.done(args);
    },

    webLocateFail: function() {
      this.fail();
    },

    getStoragePosition: function () {

      var currentDistrict = window.localStorage.getItem(this.localStorageKey);

      try {
        currentDistrict = JSON.parse(currentDistrict);
      } catch (e) {
        currentDistrict = null;
      }

      return currentDistrict;
    },

    setStoragePosition: function (args) {

      window.localStorage.setItem(this.localStorageKey, JSON.stringify(args));

    }

  };

  return locateService;

});
