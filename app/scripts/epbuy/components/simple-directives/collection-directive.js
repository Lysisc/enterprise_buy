'use strict';

angular.module('EPBUY')

// 收藏
.directive('collectionCtrl', function ($timeout, Util, DataCachePool) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            var goodsObj = JSON.parse(attr.item ? attr.item : false);

            if (!goodsObj) {
                return;
            }

            var collectGoods = DataCachePool.pull('COLLECTION_GOODS') || [],
                collectIndex = -1,
                isCollect = function (is) {
                    if (is !== undefined) {
                        if (attr.index) {
                            scope.isCollect[attr.index] = is;
                        } else {
                            scope.isCollect = is;
                        }
                    } else {
                        return attr.index ? scope.isCollect[attr.index] : scope.isCollect;
                    }
                };

            $timeout(function () {
                for (var i = 0; i < collectGoods.length; i++) {
                    if (collectGoods[i].InnerId == goodsObj.InnerId) {
                        collectIndex = i;
                        isCollect(true);
                        break;
                    }
                }
            }, 0);

            element.on('click', function (e) {
                if (isCollect()) {
                    $timeout(function () {
                        isCollect(false);
                    }, 100);
                    collectGoods.splice(collectIndex, 1);
                    DataCachePool.push('COLLECTION_GOODS', collectGoods);
                } else {
                    $timeout(function () {
                        isCollect(true);
                    }, 100);
                    var obj = {
                        Id: goodsObj.ProductID,
                        InnerId: goodsObj.InnerId,
                        Title: goodsObj.Name,
                        ImgUrl: goodsObj.Picture
                    };
                    collectGoods.unshift(obj);
                    DataCachePool.push('COLLECTION_GOODS', collectGoods);
                }

            });

        }
    };
});
