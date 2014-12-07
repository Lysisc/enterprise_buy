'use strict';

angular.module('EPBUY')
    .controller('FoodsHotCtrl', function ($scope, $stateParams, $geo, $http, $ubt, $compile, $ionicScrollDelegate, pageStatus, Util, ENV) {

        $scope.pageTitle = '人气餐馆';

        $scope.districtId = parseInt($stateParams.DestinationId); //目的地ID

        $geo.getInfo(function (args) {
            $scope.CurrentDestId = parseInt(args.cityId);
            $scope.LocationLat = args.lat;
            $scope.LocationLon = args.lon;
            ajaxRequest();
        }, function () {
            $scope.CurrentDestId = 0;
            $scope.LocationLon = 0;
            $scope.LocationLat = 0;
            ajaxRequest();
        }, 'GS_FOODS_GEOINFO');

        var handler = $ionicScrollDelegate.$getByHandle('scrollContent');
        var titleEles;

        var pageStatusInit = pageStatus.pageStatusInit($scope, $stateParams);

        pageStatusInit.loading(false);

        function ajaxRequest() {
            $http({
                url: ENV.getDomain() + '/GetMostPopularRestaurants.json' + '?DestinationId=' + $scope.districtId + '&CurrentDestId=' + $scope.CurrentDestId + '&LocationLon=' + $scope.LocationLon + '&LocationLat=' + $scope.LocationLat,
                method: 'GET'
            }).success(function (res) {
                if (!!res.MostPopularRestaurantPageViewModel) {
                    $scope.topOne = res.MostPopularRestaurantPageViewModel.TopRestaurants[0];
                    $scope.topTwo = res.MostPopularRestaurantPageViewModel.TopRestaurants[1];
                    $scope.banner = res.MostPopularRestaurantPageViewModel.HighestCommentRestaurant;
                    $scope.restaurants = res.MostPopularRestaurantPageViewModel.Restaurants;
                    $scope.formatRestaurantName = Util.formatRestaurantName;
                    pageStatusInit.loadSuccess();
                } else {
                    pageStatusInit.loadError(true);
                }

                titleEles = window.document.querySelectorAll('.hot_title');
            }).error(function () {
                pageStatusInit.loadError(true);
            });
        }

        $scope.onScroll = function () {
            Util.stickyTopScroll($scope, titleEles, handler);
        };

        $ubt.setPageId({
            // hybrid: 10086,
            // browser: 95555
        });

        $ubt.send();

    });