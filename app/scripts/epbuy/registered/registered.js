'use strict';

angular.module('EPBUY')
    .controller('RegisteredCtrl', function ($scope, $state, $http, $ionicBackdrop, $ionicLoading, ENV, Util) {

        Util.focusInput($scope);

        $scope.stepInit = true; //step1 view
        $scope.stepOneDisabled = true; //step1 submit
        $scope.stepOnePass = false; //step2 view
        $scope.stepTwoDisabled = true; //step2 submit

        $scope.showSearch = function () { //显示隐藏企业码搜索
            if ($scope.searching) {
                $scope.searching = false;
                $scope.inputChange($scope.enterpriseCode);
            } else {
                $scope.searching = true;
            }
        };

        $scope.chooseItemSearch = function (e, itemId) { //选择企业
            console.log(itemId);
            angular.element(document.querySelectorAll('.search-item')).removeClass('cur');
            angular.element(e.target).addClass('cur');
            if (itemId) {
                $scope.enterpriseCode = itemId;
                $scope.stepOneDisabled = false;
                $scope.searching = false;
            } else {
                console.log('itemId error');
            }
        };

        // $scope.confirmSearch = function () {
        //     $scope.searching = false;
        // };

        $scope.inputChange = function (val) { //监听企业码输入框的值
            $scope.enterpriseCode = val;
            if (val) {
                $scope.stepOneDisabled = false;
            } else {
                $scope.stepOneDisabled = true;
            }
        };

        $scope.goStepTwo = function () { //去第二步
            $ionicBackdrop.retain();
            $ionicLoading.show({
                template: 'Loading...'
            });
            $http({
                method: 'GET',
                url: ENV.getDomain() + '/GetHomeRestaurantBannerInfo.json'
            }).success(function (data) {
                console.log(data);
                $ionicBackdrop.release();
                $scope.stepInit = false;
                $scope.stepOnePass = true;
            }).error(function () {

            });
        };

    });