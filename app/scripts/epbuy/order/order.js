'use strict';

angular.module('EPBUY')
    .controller('OrderCtrl', function ($rootScope, $scope, $state, $stateParams, $ionicPopup, Util) {

        $scope.cartNum = 0;
        $scope.cartPrice = 0;

        // var jmz = {}; //js判断字符串长度（含中文）
        // jmz.GetLength = function (str) {
        //     ///<summary>获得字符串实际长度，中文2，英文1</summary>
        //     ///<param name="str">要获得长度的字符串</param>
        //     var realLength = 0,
        //         len = str.length,
        //         charCode = -1;
        //     for (var i = 0; i < len; i++) {
        //         charCode = str.charCodeAt(i);
        //         if (charCode >= 0 && charCode <= 128) realLength += 1;
        //         else realLength += 2;
        //     }
        //     return realLength;
        // };

        Util.ajaxRequest({
            url: '$local/GetHomeRestaurantBannerInfo.json',
            data: {
                enterpriseCode: $scope.enterpriseCode // todo...
            },
            success: function (data) {

                console.log('我是确认订单页');
                // todo...
            }
        });

        $scope.toJump = function (e, index) {
            $state.go('epbuy.choice', {
                idx: index
            });
        };

        var remarkText = null;
        $scope.checkRemark = function (e, remark) { // 备注要求
            var el = angular.element(e.target),
                text = el.val();

            if (!text) {
                return;
            }

            if (remark) {
                $scope.remark = text;
            } else {
                remarkText = text;
                el.parent().find('p').text('请不要超过100个字');
            }
        };

        $scope.activityCheck = {};
        $scope.activityCheck.checked = false;
        $scope.activityExplain = function () { // 活动声明
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

        if ($rootScope.addressObj) {
            $scope.hasAddress = $rootScope.addressObj;
            console.log($scope.hasAddress);
        } else {
            $scope.hasAddress = false; //是否有收货地址
        }

        $scope.placeTheOrder = function () {
            if (!$scope.hasAddress) {
                Util.msgToast($scope, '请添加收货地址');
                return;
            }

            if (!$scope.activityCheck.checked) {
                Util.msgToast($scope, '请查看活动及售后服务说明');
                return;
            }

            if (remarkText && !$scope.remark) {
                Util.msgToast($scope, '备注超过100个字，请删减');
                return;
            }

            //todo...
        };

    });