'use strict';

angular.module('EPBUY')

// <a class="goods-item" epbuy-jump="detail" goods-id="1234" ng-repeat="(index, item) in goodsList">
.directive('epbuyJump', function ($state) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {

            var pageName = attr.epbuyJump;

            // $state.go('.', {}, {
            //     reload: true
            // });

            element.on('click', function () {
                switch (pageName) {
                case 'login':
                    $state.go('epbuy.login');
                    break;
                case 'registered':
                    $state.go('epbuy.registered');
                    break;
                case 'home':
                    $state.go('epbuy.home');
                    break;
                case 'list':
                    $state.go('epbuy.list');
                    break;
                case 'heart':
                    $state.go('epbuy.heart');
                    break;
                case 'detail':
                    var goodsId = attr.goodsId;
                    $state.go('epbuy.detail', {
                        GoodsId: goodsId
                    });
                    break;
                case 'address':
                    var type = attr.addressType,
                        index = attr.addressIndex;
                    $state.go('epbuy.address', {
                        Type: type,
                        idx: index
                    });
                    break;
                }
            });
        }
    };
});