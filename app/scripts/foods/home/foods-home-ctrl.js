'use strict';

angular.module('GSH5')
  .controller('FoodsHomeCtrl', function ($scope, $geo, $stateParams, $ionicPopup, $http, $timeout, $compile, $q, ENV, pageStatus, Util, DataCachePool, Notification, $state) {

    $scope.onScroll = function () {
      var serIpt = window.document.getElementById('searchInput');
      serIpt.blur();
    };

    var viewDestId = window.sessionStorage.ViewDestId || 2;

    $scope.pageTitle = '<a class="home-title">' + (window.sessionStorage.ViewDestName || '上海') + '美食' + '</a>';
    $scope.searchObj = {};
    $scope.formatRestaurantName = Util.formatRestaurantName;

    // 初始化title点击事件（从下而上翻出目的地切换页）
    var titleEle = window.document.querySelector('ion-nav-bar'),
      navView = window.document.querySelector('ion-nav-view'),
      gotoSwitchDestination = function () {
        navView.classList.add('slide-bottom-top');
        navView.classList.remove('reverse');
        $state.go('foods.destinationSwitch');
      };

    titleEle.onclick = function (e) {
      if (e && /home-title/.test(e.target.className)) {
        gotoSwitchDestination();
      }
    };

    var formatSearchList = function (list) {
      if (!list) {
        return null;
      }
      var listArr = [],
        nearArr = [];
      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        item.key = item.Name;
        item.Href = '#/foods/findfoods/' + $scope.destId + '?title=' + item.key;
        if (item.ItemType <= 3) {
          switch (item.ItemType) {
          case 1:
            item.Href += '&brand=' + item.Id;
            break;
          case 2:
            item.Href += '&keyword=' + item.key;
            break;
          case 3:
            item.Href += '&foodname=' + item.Id;
            break;
          }
          item.Name = item.Name.replace(new RegExp($scope.searchObj.key, 'ig'), '<i>' + $scope.searchObj.key + '</i>');
          listArr.push(item);
        } else {
          var str = '';
          switch (item.ItemType) {
          case 4:
            str = '”餐馆';
            item.Href += '&food=' + item.Id;
            break;
          case 5:
            str = '”附近餐馆';
            item.Href += '&positionlon=' + item.Lon + '&positionlat=' + item.Lat;
            break;
          case 6:
            str = '”相关餐馆';
            item.Href += '&zone=' + item.Id;
            break;
          case 7:
            str = '”地铁站附近餐馆';
            item.Href += '&subwaystation=' + item.Id + '&positionlon=' + item.Lon + '&positionlat=' + item.Lat;
            break;
          }
          item.Name = '搜索“' + item.Name.replace(new RegExp($scope.searchObj.key, 'ig'), '<i>' + $scope.searchObj.key + '</i>') + str;
          nearArr.push(item);
        }
      }
      return {
        listArr: listArr,
        nearArr: nearArr
      };
    };

    var pageStatusHandler = pageStatus.pageStatusInit($scope, $compile, $stateParams);

    pageStatusHandler.loading(false);

    var showSwitchDestDialog = function () {
      if (!/home$/.test(window.location.href)) { // 如果当前已经不在主页了 则不提示
        return;
      }
      $ionicPopup.confirm({
        title: '',
        template: '当前城市定位是否正确，试试切换城市？',
        cancelText: '取消',
        okText: '去切换'
      }).then(function (res) {
        if (res) {
          gotoSwitchDestination();
        }
      });
    };

    var fetchHomePageInfo = function (currDestId, viewDestId) {
      $scope.destId = viewDestId;

      var succ = function (respObj /*, fromCache*/ ) {
        respObj = respObj || {};
        respObj.HomePageViewModel = respObj.HomePageViewModel || {
          RestaurantRankingList: [],
          FeatureRestaurantList: []
        };
        if (respObj.HomePageViewModel.RestaurantRankingList.length > 0 || respObj.HomePageViewModel.FeatureRestaurantList.length > 0) {
          if (respObj.HomePageViewModel.RestaurantRankingList) {
            var rankingLen = respObj.HomePageViewModel.RestaurantRankingList.length;
            if (rankingLen >= 4) {
              $scope.rankingNum = 4;
            } else if (rankingLen >= 2) {
              $scope.rankingNum = 2;
            } else {
              $scope.rankingNum = 0;
            }
          }

          if (respObj.HomePageViewModel.FeatureRestaurantList) {
            var featureRestLen = respObj.HomePageViewModel.FeatureRestaurantList.length;
            if (featureRestLen >= 4) {
              $scope.featureRestNum = 4;
            } else if (featureRestLen >= 2) {
              $scope.featureRestNum = 2;
            } else {
              $scope.featureRestNum = 0;
            }
          }
          // 如果没有定位到当前城市，弹出确认框，延迟3秒询问用户是否到目的地切换页手动选择
          if (!currDestId && !window.sessionStorage.ViewDestId && !window.sessionStorage.getItem('GS_FOODS_GEO_FAIL_TIP_FLAG')) {
            $timeout(showSwitchDestDialog, 3000);
            window.sessionStorage.setItem('GS_FOODS_GEO_FAIL_TIP_FLAG', true);
          }
          $scope.mainInfo = respObj.HomePageViewModel;
          /*if(!fromCache) {
            DataCachePool.push('home', viewDestId, respObj);
          }*/
          pageStatusHandler.loadSuccess();
        } else {
          pageStatusHandler.noResult();
        }
      };

      /*var respObj = DataCachePool.fetch('home', viewDestId);
      if(respObj) {
        succ(respObj, true);
      } else {*/
      $http.get(ENV.getDomain() + '/GetHomePageViewModel?ViewDestId=' + parseInt(viewDestId)).success(function (respObj) {
        succ(respObj);
      }).error(function () {
        pageStatusHandler.loadError(true);
      });
      /*}*/
    };

    var fetchRecommendRestaurantList = function (currDestId, viewDestId, lat, lon) {
      $http.get(ENV.getDomain() + '/GetRecommendRestaurantList?CurrentDestId=' + (currDestId || 0) +
        '&ViewDestId=' + parseInt(viewDestId) + '&Lat=' + (lat || 0) + '&Lon=' + (lon || 0)).success(function (listObj) {
        listObj = listObj || {};
        if (listObj.RecommendRestaurantList) {
          $scope.restaurants = listObj.RecommendRestaurantList;
        }
      });
    };

    //跳转到当地美食是否显示离我最近
    $scope.orderSort1 = '';
    // 定位当前城市
    $geo.getInfo(function (geo) {
      $scope.pageTitle = '<a class="home-title">' + (window.sessionStorage.ViewDestName || geo.cityName || '上海') + '美食' + '</a>';
      fetchRecommendRestaurantList(geo.cityId, window.sessionStorage.ViewDestId || geo.cityId || 2, geo.lat, geo.lon);
      fetchHomePageInfo(geo.cityId, window.sessionStorage.ViewDestId || geo.cityId || 2, geo.lat, geo.lon);
      if( geo.cityId !== parseInt(window.sessionStorage.ViewDestId) ){
        if(window.sessionStorage.ViewDestId === undefined&&geo.cityId===2){
          $scope.orderSort1 = 'order=1';
        }else{
          $scope.orderSort1 = '';
        }
      }else{
        $scope.orderSort1 = 'order=1';
      }
    }, function () {
      // 默认显示上海
      fetchRecommendRestaurantList(null, viewDestId);
      fetchHomePageInfo(null, viewDestId);
    });

    $scope.parseInt = function (val) {
      return parseInt(val);
    };

    $scope.onRefresh = function () {
      $scope.refreshing = true;
      var timer = $timeout(function () {
        $scope.refreshing = false;
        $timeout.cancel(timer);
      }, 3000);
    };

    $scope.onSearch = function () {
      $scope.searching = true;
    };

    var timer = null;

    $scope.onInput = function () {

      $timeout.cancel(timer);

      timer = $timeout(function () {
        if ($scope.searchObj.key) {
          $http.get(ENV.getDomain() + '/GetAutoCompletionItems?Keyword=' + $scope.searchObj.key + '&DistrictId=' + $scope.destId).success(function (searchResult) {
            $scope.showNoResult = false;
            window.document.querySelectorAll('.scroll')[1].style.cssText = '';
            if (typeof searchResult.Items !== 'undefined' && searchResult.Items.length > 0) {
              var formatDataList = formatSearchList(searchResult.Items);
              $scope.searchObj.list = formatDataList.listArr;
              $scope.searchObj.near = formatDataList.nearArr;
            } else {
              $scope.searchObj.list = [];
              $scope.searchObj.near = [];
              $scope.showNoResult = true;
            }
          });
        } else {
          $timeout.cancel();
          $scope.searchObj.list = [];
          $scope.searchObj.near = [];
          $scope.showNoResult = false;
        }
      }, 300);

    };

    $scope.clearSearch = function () {
      $scope.searchObj = {};
    };

    $scope.doSearchBack = function () {
      $scope.searching = false;
      $scope.searchObj = {};
    };

    $scope.doSearch = function () {
      if ($scope.searchObj.key) {
        window.location.href = '#/foods/findfoods/' + $scope.destId + '?keyword=' + $scope.searchObj.key + '&title=' + $scope.searchObj.key;
      } else {
        Notification.notify($scope, '请输入内容');
      }
    };

    $scope.onKeydown = function (e) {
      if (e && e.keyCode === 13) { // 敲击键盘上的 “搜索/回车”键
        e.target.blur();
        $scope.doSearch();
      }
    };

    //榜单跳转
    $scope.rankingJump = function(hreflink){
      if(!!ENV.isHybrid){
        window.location.href = 'ctrip://wireless/destination/toOperation?url='+encodeURIComponent(hreflink);
      }else{
        window.location.href = hreflink;
      }
    };
  });
