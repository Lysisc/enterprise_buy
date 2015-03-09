'use strict';

angular.module('EPBUY')
    .controller('DetailCtrl', function ($scope, $state, $stateParams, $ionicScrollDelegate, Util, DataCachePool, ENV) {

        $scope.isWant = $state.is('epbuy.want');
        $scope.tabIndex = 0;

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

        if (!ENV.isHybrid && !document.getElementById('shareBtnScript')) {
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
            var domHtml = '<div id="shareBtnCtrl" class="bdsharebuttonbox" style="display:none;"><a href="#" class="bds_tsina" data-cmd="tsina" title="分享到新浪微博"></a><a href="#" class="bds_tqq" data-cmd="tqq" title="分享到腾讯微博"></a><a href="#" class="bds_weixin" data-cmd="weixin" title="分享到微信"></a><a href="#" class="bds_sqq" data-cmd="sqq" title="分享到QQ好友"></a></div>',
                domScript = document.createElement('script');
            angular.element(document.getElementsByTagName('body')[0]).append(domHtml);
            domScript.id = 'shareBtnScript';
            domScript.src = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + new Date().getTime();
            document.getElementsByTagName('head')[0].appendChild(domScript);
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

        $scope.showLargerImg = function (src) {
            $scope.largerImg = src;
        };

        $scope.switchTab = function (index) {
            $scope.tabIndex = index;
            $scope.tabSlide = {
                'left': $scope.tabIndex ? ($scope.tabIndex * 50 + '%') : '0'
            };
            $ionicScrollDelegate.$getByHandle('contentHandle').scrollBottom();
        };

        //分享控件
        $scope.shareCtrl = function () {
            if (ENV.isHybrid) {
                var shareUrl = 'http://www.51mart.com.cn/h5/#/epbuy/';
                if ($scope.isWant) {
                    shareUrl += 'want/' + $scope.product.ProductID;
                } else {
                    shareUrl += 'detail/' + $scope.product.ProductID + '/' + $scope.product.InnerId;
                }
                window.plugins.socialsharing.share($scope.product.Name, null, null, shareUrl);
            } else {
                if ($scope.shareHtml) {
                    $scope.shareHtml = false;
                    angular.element(document.getElementById('shareBtnCtrl')).css('display', 'none');
                } else {
                    $scope.shareHtml = true;
                    angular.element(document.getElementById('shareBtnCtrl')).css('display', 'block');
                }
            }
        };

    });
