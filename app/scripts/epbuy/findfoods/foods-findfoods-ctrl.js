'use strict';

angular.module('EPBUY')
    .controller('FindFoodsCtrl', function ($scope, $stateParams, ENV, $http, $location, $geo, $compile, pageStatus, $ionicScrollDelegate) {
        $scope.isHybrid = ENV.isHybrid;

        $scope.findfoodsTitle = '当地美食';
        var locationObj = $location.search();

        if (!!locationObj.title) {
            $scope.findfoodsTitle = locationObj.title;
        }
        //定义status组件
        var pageStatusInit = pageStatus.pageStatusInit($scope, $compile, $stateParams);
        //加载动画
        pageStatusInit.loading(false);

        //定义筛选参数
        $scope.restPostData = {};
        $scope.restPostData = {
            DistrictId: parseInt($stateParams.DestinationId), //目的地ID
            CurrentDestId: 0, //定位获得的目的地ID
            CuisineId: !!locationObj.food ? parseInt(locationObj.food) : 0, //菜系ID
            FoodId: !!locationObj.foodname ? parseInt(locationObj.foodname) : 0, //菜系名ID
            ZoneId: !!locationObj.zone ? parseInt(locationObj.zone) : 0, //商圈ID
            LocationId: !!locationObj.district ? parseInt(locationObj.district) : 0, //行政区ID
            PositionLon: !!locationObj.positionlon ? parseFloat(locationObj.positionlon) : 0, //筛选位置经度
            PositionLat: !!locationObj.positionlat ? parseFloat(locationObj.positionlat) : 0, //筛选位置维度
            OrderSortId: !!locationObj.order ? parseInt(locationObj.order) : 0, //排序ID
            SellSortId: !!locationObj.sell ? locationObj.sell.split(',') : '', //优惠类型ID
            PriceSortId: !!locationObj.price ? parseInt(locationObj.price) : 0, //价格区间ID
            SceneSortId: !!locationObj.scene ? locationObj.scene.split(',') : '', //情景ID
            KeyWord: !!locationObj.keyword ? locationObj.keyword : '', //关键字ID
            BrandId: !!locationObj.brand ? parseInt(locationObj.brand) : 0 //关键字ID
        };
        $scope.SubwayStationId = !!locationObj.subwaystation ? parseInt(locationObj.subwaystation) : 0; //地铁站ID
        //优惠类型数组里的数据格式转为int型,优惠类型必只有一个数据
        if ($scope.restPostData.SellSortId.length > 0) {
            $scope.restPostData.SellSortId[0] = parseInt($scope.restPostData.SellSortId[0]);
        }
        //情景类型数组里的数据格式转为int型
        if ($scope.restPostData.SceneSortId.length > 0) {
            for (var sencesortnum = 0; sencesortnum < $scope.restPostData.SceneSortId.length; sencesortnum++) {
                $scope.restPostData.SceneSortId[sencesortnum] = parseInt($scope.restPostData.SceneSortId[sencesortnum]);
            }
        }

        //分页
        $scope.restPostData.PageIndex = 1;
        //每页数据数目
        $scope.restPostData.PageSize = 20;
        //正在定位
        $scope.loadPosition = true;
        $scope.nowPositionName = '正在定位...';
        //经纬度
        $scope.restPostData.LocationLon = 0;
        $scope.restPostData.LocationLat = 0;

        //定位
        $scope.refreshLocation = function () {
            $scope.loadPosition = true;
            // $scope.nowPositionName = '正在定位...';
            //重新定位
            $geo.getInfo(function (args) {
                if ($scope.nowPositionName === args.address && $scope.restPostData.CurrentDestId === parseInt(args.cityId)) {
                    $scope.loadPosition = false;
                    return false;
                } else {
                    $scope.nowPositionName = '正在定位...';
                    $scope.restPostData.LocationLat = args.lat;
                    $scope.restPostData.LocationLon = args.lon;
                    $scope.loadPosition = false;
                    $scope.nowPositionName = args.address;
                    $scope.restPostData.CurrentDestId = parseInt(args.cityId);
                    //筛选POST对象
                    $scope.filterPostData = {
                        DestinationId: $scope.restPostData.DistrictId,
                        CurrentDestId: $scope.restPostData.CurrentDestId,
                        LocationLon: $scope.restPostData.LocationLon,
                        LocationLat: $scope.restPostData.LocationLat
                    };
                    $scope.ifFirstFilter = true;
                    filterResultAjax();
                    // filterDataAjax();
                    ajaxLoadLists();
                }
            }, function () {
                if ($scope.restPostData.LocationLon === 0 && $scope.restPostData.LocationLat === 0) {
                    $scope.loadPosition = false;
                    return false;
                } else {
                    $scope.restPostData.LocationLon = 0;
                    $scope.restPostData.LocationLat = 0;
                    $scope.restPostData.CurrentDestId = 0;
                    $scope.loadPosition = false;
                    $scope.nowPositionName = '定位失败'; //筛选POST对象
                    $scope.filterPostData = {
                        DestinationId: $scope.restPostData.DistrictId,
                        CurrentDestId: $scope.restPostData.CurrentDestId,
                        LocationLon: $scope.restPostData.LocationLon,
                        LocationLat: $scope.restPostData.LocationLat
                    };
                    $scope.ifFirstFilter = true;
                    // filterDataAjax();
                    filterResultAjax();
                    ajaxLoadLists();
                }
            }, {
                refresh: true
            });
        };

        // var filterDataSuccess = false;
        // var restlistDataSuccess = false;
        //筛选3个tab的文案
        $scope.filterResultDate = {};
        $scope.filterResultDate.CuisineName = '全部菜系';
        $scope.filterResultDate.LocationName = '全部区域';
        $scope.filterResultDate.OrderName = '默认排序';

        function filterResultAjax() {
                $scope.filterResultPostData = {
                    DestinationId: $scope.restPostData.DistrictId,
                    CuisineId: $scope.restPostData.CuisineId,
                    ZoneId: $scope.restPostData.ZoneId,
                    LocationId: $scope.restPostData.LocationId,
                    OrderSortId: $scope.restPostData.OrderSortId,
                    SubstationId: $scope.SubwayStationId
                };
                $http({
                    method: 'POST',
                    data: $scope.filterResultPostData,
                    url: ENV.getDomain() + '/GetFilterResultModel.json'
                }).success(function (data) {
                    $scope.filterResultDate = data;
                });
            }
            //筛选数据
        function filterDataAjax() {
            $http({
                method: 'POST',
                data: $scope.filterPostData,
                url: ENV.getDomain() + '/GetFilterViewModel.json'
            }).success(function (data) {
                $scope.filterDate = data;
                $scope.ifFirstFilter = false;
            });
        }

        //是否显示全部类型
        if ($scope.restPostData.SellSortId === '' && $scope.restPostData.PriceSortId === 0 && $scope.restPostData.SceneSortId === '') {
            $scope.bfAllSort = true;
        } else {
            $scope.bfAllSort = false;
        }

        //定义餐馆列表数据
        $scope.restaurants = [];
        //判断下一页是否有数据，true为有数据，false显示无数据提示
        $scope.ifLoadRest = true;
        $scope.ifFirstLoad = true;

        //列表数据
        $scope.loadRest = function (pageIndex) {
            // $scope.ajaxloading = false;
            // angular.element(window.document.getElementsByTagName('ion-infinite-scroll')).children().addClass('ng-hide');
            // window.alert(1);
            function loadRest(pagenum) {
                $http({
                    method: 'POST',
                    data: $scope.restPostData,
                    url: ENV.getDomain() + '/GetDiscoveryFoodPageViewModel.json'
                }).success(function (data) {
                    for (var d = 0; d < data.Restaurants.length; d++) {
                        $scope.restaurants.push(data.Restaurants[d]);
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');

                    if ($scope.restPostData.PageIndex * $scope.restPostData.PageSize > data.TotalCount) {
                        $scope.ifLoadRest = false;
                        angular.element(window.document.getElementsByTagName('ion-infinite-scroll')).children().addClass('ng-hide');
                    }
                    $scope.restPostData.PageIndex = pageIndex;
                    $scope.restPostData.PageIndex++;

                    $scope.ajaxloading = false;

                    pageStatusInit.loadSuccess();

                    // restlistDataSuccess = true;
                    // if(filterDataSuccess===true){
                    // }
                }).error(function () {
                    if (pagenum === 1) {
                        pageStatusInit.loadError(true);
                    }
                });
            }
            if (!!$scope.ifLoadRest) {
                //第一次加载数据，需要第一次定位
                if (pageIndex === 1) {
                    angular.element(window.document.getElementsByTagName('ion-infinite-scroll')).children().addClass('ng-hide');
                    //第一次定位
                    $geo.getInfo(function (args) {
                        $scope.restPostData.LocationLat = args.lat;
                        $scope.restPostData.LocationLon = args.lon;
                        $scope.restPostData.CurrentDestId = parseInt(args.cityId);
                        //筛选POST对象
                        $scope.filterPostData = {
                            DestinationId: $scope.restPostData.DistrictId,
                            CurrentDestId: $scope.restPostData.CurrentDestId,
                            LocationLon: $scope.restPostData.LocationLon,
                            LocationLat: $scope.restPostData.LocationLat
                        };
                        if ($scope.ifFirstLoad) {
                            $scope.ifFirstFilter = true;
                            filterResultAjax();
                        }
                        // filterDataAjax();
                        $scope.loadPosition = false;
                        $scope.nowPositionName = args.address;
                        loadRest(1);
                    }, function () {
                        $scope.restPostData.LocationLon = 0;
                        $scope.restPostData.LocationLat = 0;
                        $scope.restPostData.CurrentDestId = 0;
                        $scope.loadPosition = false;
                        $scope.nowPositionName = '定位失败';
                        //筛选POST对象
                        $scope.filterPostData = {
                            DestinationId: $scope.restPostData.DistrictId,
                            CurrentDestId: $scope.restPostData.CurrentDestId,
                            LocationLon: $scope.restPostData.LocationLon,
                            LocationLat: $scope.restPostData.LocationLat
                        };
                        if ($scope.ifFirstLoad) {
                            $scope.ifFirstFilter = true;
                            filterResultAjax();
                        }
                        // filterDataAjax();
                        loadRest(1);
                    });
                } else {
                    angular.element(window.document.getElementsByTagName('ion-infinite-scroll')).children().removeClass('ng-hide');
                    loadRest(2);
                }
                //angular.element(document.getElementsByTagName('ion-infinite-scroll')[0].children()[0].addClass('ng-hide'));
            }
        };

        //定义location的地址字符串
        var hrefnum = '';
        //是否显示正在加载文案,非下拉刷新的加载文案
        $scope.ajaxloading = false;
        //ajax获取数据
        var ajaxFindFoods = function () {
            // $scope.ajaxloading = true;
            // $scope.restaurants = [];
            hrefnum = 'food=' + $scope.restPostData.CuisineId + '&zone=' + $scope.restPostData.ZoneId + '&district=' + $scope.restPostData.LocationId + '&subwaystation=' + $scope.SubwayStationId + '&positionlon=' + $scope.restPostData.PositionLon + '&positionlat=' + $scope.restPostData.PositionLat + '&order=' + $scope.restPostData.OrderSortId + '&sell=' + $scope.restPostData.SellSortId + '&price=' + $scope.restPostData.PriceSortId + '&scene=' + $scope.restPostData.SceneSortId + '&brand=' + $scope.restPostData.BrandId + '&foodname=' + $scope.restPostData.FoodId;
            $location.search(hrefnum);
        };

        var ajaxLoadLists = function () {
            //重新定义数据
            locationObj = $location.search();
            $scope.restPostData.DistrictId = parseInt($stateParams.DestinationId); //目的地ID
            $scope.restPostData.CuisineId = !!locationObj.food ? parseInt(locationObj.food) : 0; //菜系ID
            $scope.restPostData.FoodId = !!locationObj.foodname ? parseInt(locationObj.foodname) : 0; //菜系名ID
            $scope.restPostData.ZoneId = !!locationObj.zone ? parseInt(locationObj.zone) : 0; //商圈ID
            $scope.restPostData.LocationId = !!locationObj.district ? parseInt(locationObj.district) : 0; //行政区ID
            $scope.restPostData.PositionLon = !!locationObj.positionlon ? parseFloat(locationObj.positionlon) : 0; //筛选位置经度
            $scope.restPostData.PositionLat = !!locationObj.positionlat ? parseFloat(locationObj.positionlat) : 0; //筛选位置维度
            $scope.restPostData.OrderSortId = !!locationObj.order ? parseInt(locationObj.order) : 0; //排序ID
            $scope.restPostData.SellSortId = !!locationObj.sell ? locationObj.sell.split(',') : ''; //优惠类型ID
            $scope.restPostData.PriceSortId = !!locationObj.price ? parseInt(locationObj.price) : 0; //价格区间ID
            $scope.restPostData.SceneSortId = !!locationObj.scene ? locationObj.scene.split(',') : ''; //情景ID
            $scope.restPostData.KeyWord = !!locationObj.keyword ? locationObj.keyword : ''; //关键字ID
            $scope.restPostData.BrandId = !!locationObj.brand ? parseInt(locationObj.brand) : 0; //关键字ID
            $scope.SubwayStationId = !!locationObj.subwaystation ? parseInt(locationObj.subwaystation) : 0; //地铁站ID
            //优惠类型数组里的数据格式转为int型,优惠类型必只有一个数据
            if ($scope.restPostData.SellSortId.length > 0) {
                $scope.restPostData.SellSortId[0] = parseInt($scope.restPostData.SellSortId[0]);
            }
            //情景类型数组里的数据格式转为int型
            if ($scope.restPostData.SceneSortId.length > 0) {
                for (var sencesortnum = 0; sencesortnum < $scope.restPostData.SceneSortId.length; sencesortnum++) {
                    $scope.restPostData.SceneSortId[sencesortnum] = parseInt($scope.restPostData.SceneSortId[sencesortnum]);
                }
            }
            $scope.restaurants = [];
            var commentScroll = $ionicScrollDelegate.$getByHandle('findFoodsScroll').getScrollPosition();
            $ionicScrollDelegate.$getByHandle('findFoodsScroll').scrollTo(-commentScroll.Top, false);
            $scope.ajaxloading = true;
            $scope.choosebg = false;
            $scope.choosetab = 0;
            $scope.ifLoadRest = true;
            $scope.ifFirstLoad = false;
            $scope.restPostData.PageIndex = 1;
            // $http({
            //   method: 'POST',
            //   data: $scope.restPostData,
            //   url: ENV.getDomain()+'/GetDiscoveryFoodPageViewModel.json'
            // }).success(function(data) {
            //   // $scope.ajaxloading = false;
            //   $scope.restaurants = data.Restaurants;
            //   $scope.restPostData.PageIndex = 2;
            //   $scope.ajaxloading = false;
            // }).error(function(){
            //   // $scope.ajaxloading = false;
            //   pageStatusInit.loadError(true);
            // });
        };
        //页面地址location参数变化时触发，包括筛选事件和后退事件
        $scope.$on('$locationChangeSuccess', function () {
            if (window.location.href.indexOf('findfoods') > -1) {
                ajaxLoadLists();
            }
        });

        //TAB弹层显示
        $scope.choosetab = 0;
        $scope.ifFirstFilter = true;
        $scope.choosepop = function (num) {
            if ($scope.choosetab === num) {
                $scope.choosetab = 0;
                $scope.choosebg = false;
            } else {
                $scope.choosetab = num;
                $scope.choosebg = true;
                if ($scope.ifFirstFilter) {
                    filterDataAjax();
                }
            }
        };
        //给需要引用的页面的ion-view加上ng-class="{showbottomfilter:bottomFilterShow}"
        $scope.bottomFilterShow = false;
        $scope.toggleBottomFilter = function () {
            $scope.bottomFilterShow = $scope.bottomFilterShow === false ? true : false;
            $scope.choosebg = false;
            $scope.choosetab = 0;
            if ($scope.ifFirstFilter) {
                filterDataAjax();
            }
        };

        //设置菜系ID
        $scope.setFoodSortId = function (num, name) {
            if (name === '全部') {
                $scope.filterResultDate.CuisineName = $scope.msCurrentSort;
            } else {
                $scope.filterResultDate.CuisineName = name;
            }
            $scope.restPostData.CuisineId = num;
            //$scope.topfilter.foodSortTitle = name;
            $scope.choosebg = false;
            $scope.choosetab = 0;
            ajaxFindFoods();
        };
        //设置区域ID
        $scope.setAreaSortId = function (num, name, areatype) {
            $scope.restPostData.PositionLon = 0;
            $scope.restPostData.PositionLat = 0;
            $scope.restPostData.LocationId = 0;
            $scope.restPostData.ZoneId = 0;
            $scope.SubwayStationId = 0;

            switch (areatype) {
            case 'zones':
                $scope.restPostData.ZoneId = num;
                break;
            case 'districts':
                $scope.restPostData.LocationId = num;
                break;
            }
            $scope.filterResultDate.LocationName = name;
            $scope.choosebg = false;
            $scope.choosetab = 0;
            ajaxFindFoods();
        };
        //设置地铁站及其坐标
        $scope.setSubwayStation = function (num, name, lat, lon) {
            $scope.restPostData.PositionLon = 0;
            $scope.restPostData.PositionLat = 0;
            $scope.restPostData.LocationId = 0;
            $scope.restPostData.ZoneId = 0;
            $scope.SubwayStationId = 0;

            $scope.restPostData.PositionLon = lon;
            $scope.restPostData.PositionLat = lat;
            $scope.SubwayStationId = num;
            $scope.filterResultDate.LocationName = name;
            $scope.choosebg = false;
            $scope.choosetab = 0;
            ajaxFindFoods();
        };
        //设置排序ID
        $scope.setOrderSortId = function (num, name) {
            $scope.restPostData.OrderSortId = num;
            $scope.filterResultDate.OrderName = name;
            $scope.choosebg = false;
            $scope.choosetab = 0;
            ajaxFindFoods();
        };
        //设置优惠类型
        $scope.SetSellSort = function (num) {
            if ($scope.restPostData.SellSortId === num) {
                $scope.restPostData.SellSortId[0] = 0;
            } else {
                $scope.bfAllSort = false;
                $scope.restPostData.SellSortId = num;
            }
        };
        //设置价格区间参数
        $scope.SetPriceSort = function (num) {
            $scope.bfAllSort = false;
            $scope.restPostData.PriceSortId = num;
        };
        //底部筛选提交按钮
        $scope.bottomFilter = function () {
            if ($scope.SceneSort.length > 1) {
                var SceneSortArray = [];
                for (var n = 1; n < $scope.SceneSort.length; n++) {
                    if (!!$scope.SceneSort[n]) {
                        SceneSortArray.push(n);
                    }
                }
                if (SceneSortArray.length > 0) {
                    $scope.restPostData.SceneSortId = SceneSortArray;
                } else {
                    $scope.restPostData.SceneSortId = '';
                }
            }

            $scope.bottomFilterShow = false;
            ajaxFindFoods();
        };

        // 显示地图视图
        $scope.toMap = function () {
            // if (!$scope.restaurants) {
            //   return;
            // }
            var poiList = [];
            for (var resnum = 0; resnum < $scope.restaurants.length; resnum++) {
                poiList.push({
                    'poiId': $scope.restaurants[resnum].RestaurantId,
                    'poiName': $scope.restaurants[resnum].RestaurantName,
                    'price': $scope.restaurants[resnum].AveragePrice,
                    'score': parseInt($scope.restaurants[resnum].CommentScore),
                    'latitude': $scope.restaurants[resnum].Lat,
                    'longtitude': $scope.restaurants[resnum].Lon
                });
            }

            // var checkVersion = window.navigator.userAgent.match(/OS/i);
            // var osVersion = checkVersion !== null ? checkVersion[0] : 0;
            // if (osVersion === 'OS') {
            //   window.CtripUtil.app_open_url(
            //     'ctrip://wireless/destination/toListMap?type=3&list=' + encodeURIComponent(JSON.stringify(poiList)), 1);
            // }else{
            window.CtripUtil.app_open_url(
                'ctrip://wireless/destination/toListMap?type=3&list=' + encodeURIComponent('{"poiList":' + JSON.stringify(poiList) + '}'), 1);
            // }
        };

        // var getFilterText = function(){
        //     //如果CuisineId不等于0，查询数据改变foodSortTitle
        //     if ($scope.restPostData.CuisineId !== 0) {
        //       var foodSortObj = $scope.filterDate.Cuisines.where('( el, i, res, param ) => el.CuisineId == param', $scope.restPostData.CuisineId);
        //       if (foodSortObj.length === 0) {
        //         for (var foodarray = 0; foodarray < $scope.filterDate.Cuisines.length; foodarray++) {
        //           foodSortObj = $scope.filterDate.Cuisines[foodarray].ChildCuisines.where('( el, i, res, param ) => el.CuisineId == param', $scope.restPostData.CuisineId
        //             );
        //           if (foodSortObj.length > 0) {
        //             $scope.foodSortTitle = foodSortObj[0].CuisineName;
        //             break;
        //           }
        //         }
        //       } else {
        //         $scope.foodSortTitle = foodSortObj[0].CuisineName;
        //       }
        //     }
        //     if ($scope.filterDate.Cuisines.length > 0) {
        //       $scope.msCurrentSort = $scope.filterDate.Cuisines[0].CuisineName;
        //     }
        //     //商圈ID
        //     if ($scope.restPostData.ZoneId !== 0) {
        //       var zoneObj = $scope.filterDate.Zones.where('( el, i, res, param ) => el.ZoneId == param', $scope.restPostData.ZoneId);
        //       $scope.areaSortTitle = zoneObj[0].ZoneName;
        //     }
        //     //行政区ID
        //     if ($scope.restPostData.LocationId !== 0) {
        //       var districtObj = $scope.filterDate.Districts.where('( el, i, res, param ) => el.DistrictId == param', $scope.restPostData.LocationId);
        //       $scope.areaSortTitle = districtObj[0].DistrictName;
        //     }
        //     //地铁线路ID
        //     // if ($scope.SubwayId !== '0') {
        //     //   var subwayObj = $scope.filterDate.SubwayLines.where('( el, i, res, param ) => el.SubwayLineId == param', $scope.SubwayId);
        //     //   $scope.areaSortTitle = subwayObj[0].SubwayLineName;
        //     // }
        //     //地铁站ID
        //     if ($scope.SubwayStationId !== 0) {
        //       for (var subwayStationArray = 0; subwayStationArray < $scope.filterDate.SubwayLines.length; subwayStationArray++) {
        //         var subwaiStationObj = $scope.filterDate.SubwayLines[subwayStationArray].SubwayStations.where('( el, i, res, param ) => el.SubwayStationId == param', $scope.SubwayStationId);
        //         $scope.areaSortTitle = subwaiStationObj[0].SubwayStationName;
        //         break;
        //       }
        //     }
        //     //$scope.subwayCurrentSort = $scope.filterDate.SubwayLines[0].SubwayLineName;
        //     //排序ID
        //     if ($scope.restPostData.orderSortId !== 0) {
        //       var orderSortObj = $scope.filterDate.DefaultSort.where('( el, i, res, param ) => el.Id == param', $scope.restPostData.OrderSortId);
        //       $scope.orderSortTitle = orderSortObj[0].Name;
        //     }
        // };

        //查询json数据结构方法
        // Array.prototype.where = function(f) {
        //   var fn = f;
        //   if (typeof f === 'string') {
        //     if ((fn = lambda(fn)) === null) {
        //       throw 'Syntax error in lambda string: ' + f;
        //     }
        //   }
        //   var res = [];
        //   var l = this.length;
        //   var p = [0, 0, res];
        //   for (var k = 1; k < arguments.length; k++) {
        //     p.push(arguments[k]);
        //   }
        //   for (var i = 0; i < l; i++) {
        //     if (typeof this[i] === 'undefined') {
        //       continue;
        //     }
        //     p[0] = this[i];
        //     p[1] = i;
        //     if (!!fn.apply(this, p)) {
        //       res.push(this[i]);
        //     }
        //   }
        //   return res;
        // };
        // function lambda(l) {
        //   var fn = l.match(/\((.*)\)\s*=>\s*(.*)/);
        //   var p = [];
        //   var b = '';
        //   if (fn.length > 0) {
        //     fn.shift();
        //   }
        //   if (fn.length > 0) {
        //     b = fn.pop();
        //   }
        //   if (fn.length > 0) {
        //     p = fn.pop().replace(/^\s*|\s(?=\s)|\s*$|,/g, '').split(' ');
        //   }
        //   fn = ((!/\s*return\s+/.test(b)) ? 'return ' : '') + b;
        //   p.push(fn);
        //   try {
        //     return Function.apply({}, p);
        //   } catch (e) {
        //     return null;
        //   }
        // }

    });
