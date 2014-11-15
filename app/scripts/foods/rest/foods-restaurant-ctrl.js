'use strict';

angular.module('GSH5')
  .controller('FoodsRestaurantCtrl', function ($scope, $stateParams, $http, $ionicActionSheet, $timeout, $userService, $state, $ionicBackdrop, $compile, ENV, Util, pageStatus, Notification, $location) {

    $scope.isHybrid = ENV.isHybrid;
    $scope.Infinity = Infinity;
    $scope.grouponNum = 3;
    $scope.productCount = 0;

    var pageStatusHandler = pageStatus.pageStatusInit($scope, $compile, $stateParams);

    pageStatusHandler.loading(false);

    $http.get(ENV.getDomain() + '/GetRestaurantPageViewModel?RestaurantId=' + $stateParams.RestaurantId + '&Token=' + $userService.getAuth()).success(function (resObj) {
      if (resObj) {
        $scope.rest = resObj;
        $scope.rest.RestaurantViewModel = $scope.rest.RestaurantViewModel || {};
        $scope.restName = Util.formatRestaurantName($scope.rest.RestaurantViewModel.RestaurantName, $scope.rest.RestaurantViewModel.Alias);
      }
      pageStatusHandler.loadSuccess();
    }).error(function () {
      pageStatusHandler.loadError(true);
    });

    $http.get(ENV.getDomain() + '/GetGMMerchantOrGrouponProductByRestaurantId?RestaurantId=' +
      $stateParams.RestaurantId + '&Token=' + $userService.getAuth()).success(function (resObj) {
      if (resObj) {
        if (resObj.GMMerchant && resObj.GMMerchant.MerchantId !== -1) { // 高端商户
          var count = 0;
          $scope.IsSuperior = true;
          $scope.GMMerchant = resObj.GMMerchant;

          if (resObj.GMMerchant.RebateByAmountInfo) {
            count++;
          }
          if (resObj.GMMerchant.RebateByPercentInfo) {
            count++;
          }
          if (resObj.GMMerchant.Gift) {
            count++;
          }
          $scope.needCheckout = count > 0;
          if (resObj.GMMerchant.ProductList) {
            $scope.productCount += resObj.GMMerchant.ProductList.length;
          }
          $scope.productNum = 3 - count;
          $scope.productCount += count;

        } else if (resObj.GrouponProductList && resObj.GrouponProductList.length > 0) { // 团购
          $scope.GrouponProductList = resObj.GrouponProductList;
        }

        /*
         * 增加高端商户支付页面跳转url
         * 20140902 by lusc
         */
        if (resObj.GMMerchant) {
          var proInfo = resObj.GMMerchant;
          var salesId = '&salesid=';
          var rebate = '&';
          if (proInfo.SpotPaymentProductionId) {
            salesId += proInfo.SpotPaymentProductionId;
          } else {
            salesId += 0;
          }

          if (proInfo.RebateByAmountInfo) {
            rebate += 'rebate=' + proInfo.RebateByAmountInfo.Amount + '&rebateflag=' + proInfo.RebateByAmountInfo.Flag;
          }

          if (proInfo.RebateByPercentInfo) {
            rebate += 'rebateper=' + proInfo.RebateByPercentInfo.RebateByPercent;
          }

          rebate = (rebate !== '&') ? rebate : '';

          $scope.payUrl = '?restid=' + $stateParams.RestaurantId + '&proid=' + proInfo.MerchantId + salesId + rebate;
        }
        /*
         * end
         */
      }
    });

    $http.get(ENV.getDomain() + '/GetCommentListByRestaurantId?RestaurantId=' +
      $stateParams.RestaurantId + '&Token=' + $userService.getAuth()).success(function (resObj) {
      if (resObj) {
        $scope.commentList = resObj.CommentList;
      }
    });

    $http.get(ENV.getDomain() + '/QueryIsFavorited?RestaurantId=' +
      $stateParams.RestaurantId + '&Token=' + $userService.getAuth()).success(function (respObj) {
      $scope.isFav = respObj.IsFavorited;
    });

    $scope.parseInt = function (val) {
      return parseInt(val);
    };

    var doLogin = function () {
      $userService.memberLogin({
        sourcePath: window.location.href,
        replace: true,
        type: 0,
        done: null,
        fail: null
      });
    };

    // 收藏/取消收藏
    $scope.changeFav = function () {
      if ($userService.needLogin()) {
        doLogin();
      } else {
        pageStatusHandler.loading();
        var target = $scope.isFav ? 'CancelFavourite' : 'AddFavourite';
        $http.get(ENV.getDomain() + '/' + target + '?RestaurantId=' +
          $stateParams.RestaurantId + '&Token=' + $userService.getAuth()).success(function (respObj) {
          var succ = respObj.IsAddSuc || respObj.IsCancelSuc;
          if (succ) {
            $scope.isFav = !$scope.isFav;
            Notification.notify($scope, $scope.isFav ? '收藏成功' : '取消收藏成功');
          } else {
            Notification.notify($scope, $scope.isFav ? '收藏失败' : '取消收藏失败');
          }
          pageStatusHandler.loadSuccess();
        }).error(function () {
          Notification.notify($scope, $scope.isFav ? '收藏失败' : '取消收藏失败');
          pageStatusHandler.loadError();
        });
      }
    };

    // 分享
    var ifshareClick = true;
    $scope.share = function () {
      if (ifshareClick) {
        ifshareClick = false;
        if (!$scope.rest) {
          return;
        }
        var commentScoreHtml = '';
        if ($scope.rest.RestaurantViewModel.CommentScore.toFixed(1) !== '0.0') {
          commentScoreHtml = $scope.rest.RestaurantViewModel.CommentScore.toFixed(1) + '分，';
        }
        var shareParams = {
          sharetag: 'ad',
          weixinContent: '我在携程发现了“' + $scope.restName + '”餐厅，万万没想到这么美味，值得推荐！盆友，啥时候一起组局约饭饭呀。',
          weiboContent: '我在携程发现了“' + $scope.restName + '”餐厅，有机会一起去品尝。' + commentScoreHtml + '人均' + $scope.rest.RestaurantViewModel.AveragePrice + '，http://m.ctrip.com/you/foods/#/foods/rest/' + $stateParams.RestaurantId,
          shareUrl: 'http://m.ctrip.com/you/foods/#/foods/rest/' + $stateParams.RestaurantId,
          title: $scope.restName,
          picUrl: $scope.rest.RestaurantViewModel.ImageUrl
        };
        window.CtripGS.shareCommon(JSON.stringify(shareParams));
        ifshareClick = true;
      }
    };

    var hideSheet;
    //判断是否为IOS系统
    var checkVersion = window.navigator.userAgent.match(/OS/i);
    var osVersion = checkVersion !== null ? checkVersion[0] : 0;
    if (osVersion === 'OS') {
      $scope.ifIosSys = true;
    } else {
      $scope.ifIosSys = false;
    }

    var showPhoneList = function (phones) {
      if ($scope.ifIosSys) {
        var btnArr = [],
          btn;
        for (var i = 0, len = phones.length; i < len; ++i) {
          btn = {
            text: '<a class="tel_phone" href="tel:' + phones[i] + '">' + phones[i] + '</a>'
          };
          btnArr.push(btn);
        }

        $location.search('tel', '1');

        // Show the action sheet
        hideSheet = $ionicActionSheet.show({
          buttons: btnArr,
          buttonClicked: function () {
            return true;
          },
          cancelText: '取消',
          cancel: function () {
            if (!!hideSheet) {
              window.history.back();
            }
          }
        });
      } else {
        return false;
      }
    };

    $scope.$on('$locationChangeSuccess', function () {
      if (!$location.search().tel && !!hideSheet) {
        hideSheet();
        hideSheet = null;
      }
    });


    // 显示电话浮层
    $scope.phonesClicked = function (phones) {
      if (!phones || !phones.length) {
        return;
      } else {
        showPhoneList(phones);
      }
    };
    //高美跳转
    $scope.producttUrl = function (url) {
      if (url) {
        if (!!$scope.isHybrid) {
          var productlink = url.replace('http://m.ctrip.com/webapp/', '');
          window.CtripUtil.app_open_url(productlink, 4, '');
        } else {
          window.location.href = url + '&from=' + window.location.href;
        }
      }
    };
    //团购跳转
    $scope.redirectUrl = function (url) {
      if (url) {
        if (!!$scope.isHybrid) {
          window.location.href = 'ctrip://wireless/destination/toOperation?url=' + encodeURIComponent(url);
        } else {
          window.location.href = url;
        }
      }
    };

    switch (ENV.getMode()) {
    case 'waptest':
      $scope.commentUrl = 'http://m.fat51.qa.nt.ctripcorp.com/you/';
      break;
    case 'uat':
      $scope.commentUrl = 'http://m.fat51.qa.nt.ctripcorp.com/you/';
      break;
    case 'baolei':
      $scope.commentUrl = 'http://m.ctrip.com/you/';
      break;
    case 'preProduction':
      $scope.commentUrl = 'http://m.ctrip.com/you/';
      break;
    }
    // 写评论
    $scope.addComment = function () {
      if ($userService.needLogin()) {
        $userService.memberLogin({
          sourcePath: window.location.href,
          replace: true,
          type: 0,
          done: null,
          fail: null
        });
        return false;
      }
      var thisAddHref = encodeURIComponent(window.location.href + '?jumpindex=1');
      if ($scope.rest) {
        if ($scope.isHybrid) {
          window.CtripUtil.app_open_url(
            'ctrip://wireless/destination/toAddPoiCommet?poiType=3&poiId=' + $scope.rest.RestaurantViewModel.RestaurantId + '&source=&orderId=&globlePoiId=0', 1);
        } else {
          window.location.href = $scope.commentUrl + 'comment/' + $scope.rest.RestaurantViewModel.RestaurantId + '/2?from=' + thisAddHref;
        }

      }
    };

    // 评论列表页
    $scope.gotoAllComments = function () {
      var thisHref = encodeURIComponent(window.location.href + '?jumpindex=1');
      if ($scope.rest) {
        if ($scope.isHybrid) {
          window.location.href = 'ctrip://wireless/destination/toPoiCommet?poiType=3&poiId=' + $scope.rest.RestaurantViewModel.RestaurantId + '&globlePoiId=0';
        } else {
          window.location.href = $scope.commentUrl + 'detail/0/' + $scope.rest.RestaurantViewModel.RestaurantId + '/restaurant/comment?from=' + thisHref;
        }

      }
    };

    // 添加到日程
    $scope.addSchedule = function () {
      if ($scope.rest) {
        if ($userService.needLogin()) {
          doLogin();
        } else {
          window.CtripUtil.app_open_url(
            'ctrip://wireless/destination/toAddSchedule?poiType=3&poiId=' + $scope.rest.RestaurantViewModel.POIId +
            '&poiName=' + $scope.restName + '&resourceId=' + $scope.rest.RestaurantViewModel.RestaurantId, 1);
        }
      }
    };

    // 认领商户
    $scope.toCustomerClaim = function () {
      if ($scope.rest) {
        if ($userService.needLogin()) {
          doLogin();
        } else {
          pageStatusHandler.loading();
          $http.get(ENV.getDomain() + '/GetUserIdentificateInfo?Token=' + $userService.getAuth()).success(function (respObj) {
            var status = 0;
            if (respObj && respObj.IdentificateStatus) {
              status = 2;
            }
            pageStatusHandler.loadSuccess();
            window.location.href = 'ctrip://wireless/destination/toCustomerClaim?realNameAutheticateStatus=' + status + '&resourceId=' + $scope.rest.RestaurantViewModel.RestaurantId + '&resourceType=3';
          }).error(function () {
            pageStatusHandler.loadError();
            window.location.href = 'ctrip://wireless/destination/toCustomerClaim?realNameAutheticateStatus=0&resourceId=' + $scope.rest.RestaurantViewModel.RestaurantId + '&resourceType=3';
          });
        }
      }
    };

    // 显示地图视图
    $scope.toMap = function () {
      if (!ENV.isHybrid) { //如果是H5页面，则不可点击
        return;
      }

      if (!$scope.rest || !$scope.rest.RestaurantViewModel.Address) {
        return;
      }

      if ($scope.ifIosSys) {
        var ifInchina = $scope.rest.RestaurantViewModel.InChina === true ? 1 : 0;
        var mapLink = 'ctrip://wireless/destination/toPOIMap?lat=' + $scope.rest.RestaurantViewModel.Lat + '&lon=' + $scope.rest.RestaurantViewModel.Lon + '&poiName=' + encodeURIComponent($scope.restName) + '&isChina=' + ifInchina + '&trafficInfo=' + encodeURIComponent($scope.rest.RestaurantViewModel.TrafficInfo) + '&poiType=3';
        window.CtripUtil.app_open_url(mapLink, 1);
      } else {
        var poiList = [];
        poiList.push({
          'poiId': $stateParams.RestaurantId,
          'poiName': $scope.restName,
          'price': $scope.rest.RestaurantViewModel.AveragePrice,
          'score': parseInt($scope.rest.RestaurantViewModel.CommentScore),
          'latitude': $scope.rest.RestaurantViewModel.Lat,
          'longtitude': $scope.rest.RestaurantViewModel.Lon
        });
        window.CtripUtil.app_open_url(
          'ctrip://wireless/destination/toListMap?type=3&list=' + encodeURIComponent('{"poiList":' + JSON.stringify(poiList) + '}'), 1);

      }
    };

    // 显示评论图片相册
    $scope.previewImage = function (idx, list) {
      var imageList = [];
      for (var i = 0, len = list.length; i < len; i++) {
        imageList.push({
          'url': list[i]
        });
      }
      window.CtripUtil.app_open_url(
        'ctrip://wireless/destination/toPreviewImage?index=' + idx + '&list=' + JSON.stringify(imageList), 1);
    };
  });
