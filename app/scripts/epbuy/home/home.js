'use strict';

angular.module('EPBUY')
    .controller('HomeCtrl', function ($scope, $stateParams, $ionicBackdrop, $state, $compile, $q, Util) {

        $scope.shoppingCart = 11;

        $scope.onScroll = function () {
            var serIpt = document.getElementById('searchInput');
            serIpt.blur();
        };


    });