'use strict';

angular.module('EPBUY')
    .controller('DetailCtrl', function ($scope, $state, $stateParams, $ionicScrollDelegate, Util, DataCachePool) {

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
                        ProductId: goodsId,
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
                productID: $stateParams.GoodsId
            },
            success: function (data) {
                if (data.product) {
                    $scope.product = data.product;
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

    });
