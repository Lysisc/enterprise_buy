'use strict';

angular.module('EPBUY')
    .controller('HomeCtrl', function ($scope, $stateParams, $ionicBackdrop, $state, $compile, $q, Util) {

        $scope.onScroll = function () {
            var serIpt = window.document.getElementById('searchInput');
            serIpt.blur();
        };


    });