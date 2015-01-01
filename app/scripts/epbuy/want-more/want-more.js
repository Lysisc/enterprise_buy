'use strict';

angular.module('EPBUY')
    .controller('WantMoreCtrl', function ($scope, $window, $ionicPopup, Util) {

        $scope.checkRemark = function (e, wantText) { // 备注要求
            var el = angular.element(e.target),
                text = el.val();

            if (!text) {
                return;
            }

            if (!!wantText) {
                $scope.wantText = text;
                el.parent().find('p').text(text);
            } else {
                $scope.wantText = 1;
                el.parent().find('p').text('请不要超过200个字');
            }
        };

        $scope.submitForm = function () { //翻页加载

            if (!$scope.wantText) {
                Util.msgToast($scope, '请输入你想要的内容');
                return;
            }

            if ($scope.wantText === 1) {
                Util.msgToast($scope, '内容超过200个字，请删减');
                return;
            }

            Util.ajaxRequest({
                isPopup: true,
                url: '$local/GetHomeRestaurantBannerInfo.json',
                data: {
                    enterpriseCode: 'abs' // todo...
                },
                success: function (data) {
                    $ionicPopup.alert({
                        template: '提交成功！',
                        buttons: [{
                            text: '返回上一页',
                            type: 'button-positive',
                            onTap: function () {
                                $window.history.back();
                            }
                        }]
                    });
                },
                error: function (data) {
                    Util.msgToast($scope, '提交失败');
                }
            });
        };

    });