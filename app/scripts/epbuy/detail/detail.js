'use strict';

angular.module('EPBUY')
    .controller('DetailCtrl', function ($scope, $state, $stateParams, $ionicScrollDelegate, Util, DataCachePool, ENV) {

        $scope.isWant = $state.is('epbuy.want');
        $scope.tabIndex = 0;
        $scope.isInApp = ENV.isHybrid && window.plugins && window.plugins.socialsharing;

        if ($scope.isWant) { //底部bar高亮判断
            $scope.bottomBarCur = 'heart';

            $scope.wantToHeart = function (goodsId) {
                if ($scope.product.HasVote) {
                    return;
                }

                Util.ajaxRequest({
                    url: '$server/Wish/ProductVote',
                    data: {
                        Auth: DataCachePool.pull('USERAUTH'),
                        ProductId: goodsId
                    },
                    success: function (data) {
                        if (data.state === 200) {
                            $scope.product.HasVote = true;
                            $scope.product.VoteCount++;
                        } else {
                            Util.msgToast(data.msg);
                        }
                    },
                    error: function () {
                        Util.msgToast('投票失败，请查看网络');
                    }
                });
            };

        } else {
            $scope.bottomBarCur = 'home';
        }

        Util.ajaxRequest({
            url: '$server/InternalPurchase/GetProductDetail',
            data: {
                Auth: DataCachePool.pull('USERAUTH'),
                productType: $scope.isWant ? 1 : 2,
                productID: $stateParams.GoodsId,
                InnerProductId: $scope.isWant ? null : $stateParams.InnerId
            },
            success: function (data) {
                if (data.product) {
                    $scope.product = data.product;
                    $scope.product.InnerId = $stateParams.InnerId;
                    $scope.product.description = decodeURIComponent(data.product.Description || '暂无商品描述');
                    $scope.product.remark = decodeURIComponent(data.product.Remark || '暂无备注');
                    $scope.goodsPictureList = data.product.Picture2 ? data.product.Picture2.split(',') : null;

                    // 判断是否已加入购物车
                    var shoppingCart = DataCachePool.pull('SHOPPING_CART') || [];
                    for (var i = 0; i < shoppingCart.length; i++) {
                        if (shoppingCart[i].Id === $scope.product.ProductID) {
                            $scope.hasAdded = true;
                            break;
                        }
                    }

                    if (data.SpecificationList && data.SpecificationList.length > 0) {
                        $scope.specification = data.SpecificationList;
                        $scope.specificationId = data.SpecificationList[0].Id;
                    }

                } else {
                    Util.msgToast(data.msg);
                }
            }
        });

        $scope.switchTab = function (index) {
            $scope.tabIndex = index;
            $scope.tabSlide = {
                'left': $scope.tabIndex ? ($scope.tabIndex * 50 + '%') : '0'
            };
            $ionicScrollDelegate.$getByHandle('contentHandle').scrollBottom();
        };

        //分享控件
        $scope.shareCtrl = function () {
            var shareUrl = 'http://www.51mart.com.cn/h5/#/epbuy/';

            if ($scope.isWant) {
                shareUrl += 'want/' + $scope.product.ProductID;
            } else {
                shareUrl += 'detail/' + $scope.product.ProductID + '/' + $scope.product.InnerId;
            }

            if ($scope.isInApp) {
                window.plugins.socialsharing.share($scope.product.Name, null, null, shareUrl);
            } else {
                if ($scope.shareHtml) {
                    $scope.shareHtml = false;
                } else {
                    $scope.shareHtml = true;
                }
                if (document.getElementById('shareBtnCtrl')) {
                    return;
                }
                window._bd_share_config = {
                    common: {
                        bdSnsKey: {},
                        bdText: '',
                        bdMini: '2',
                        bdMiniList: false,
                        bdPic: '',
                        bdStyle: '0',
                        bdSize: '32'
                    },
                    share: {},
                    image: {
                        viewList: ['tsina', 'tqq', 'weixin', 'sqq'],
                        viewSize: '32'
                    }
                };
                var domHead = document.getElementsByTagName('head')[0],
                    domScript = document.createElement('script');
                domScript.id = 'shareBtnCtrl';
                domScript.src = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + new Date().getTime();
                domHead.appendChild(domScript);
            }
        };

    });
