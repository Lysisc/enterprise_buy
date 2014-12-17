'use strict';

angular.module('EPBUY')
    .controller('OrderCtrl', function ($scope, $state, $stateParams, $ionicPopup, Util) {

        $scope.cartNum = parseInt($stateParams.CartNum, 0);
        $scope.cartPrice = parseInt($stateParams.CartPrice, 0);
        $scope.remark = null;

        $scope.checkRemark = function (e, remark) {
            var el = angular.element(e.target),
                text = el.val();

            if (!text) {
                return;
            }

            if (remark) {
                $scope.remark = text;
            } else {
                Util.msgToast($scope, '请不要超过100个字');
                el[0].focus();
            }
        };

        $scope.activityCheck = {};
        $scope.activityCheck.checked = false;
        $scope.activityExplain = function () {
            $ionicPopup.alert({
                template: '<h4>活动声明</h4><ion-scroll>我是活动声明我是活动声明我是活动声明我是活动声明我是活动声明我是活动声明我是活动声明我是活动声明我是活动声明我是活动声明我是活动声明我是活动声明我是活动声明我是活动声明我是活动声明我是活动声明我是活动声明我是活动声明我是活动声明</ion-scroll>',
                buttons: [{
                    text: '朕知道了',
                    type: 'button-positive',
                    onTap: function () {
                        $scope.activityCheck.checked = true;
                    }
                }]
            });
        };

    });