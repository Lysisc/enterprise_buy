'use strict';

angular.module('EPBUY')
    .controller('DestinationSwitchCtrl', function ($scope, $stateParams, $compile, $http, $timeout, $ionicNavBarDelegate, $ionicScrollDelegate, $geo, Util) {
        $scope.pageTitle = '选择城市';
        $scope.tabIndex = 0;
        $scope.searchObj = {};
        $scope.CurrentDest = {};

        var hotCities = {
                'internal': ['北京', '上海', '广州', '深圳', '成都', '三亚', '厦门', '青岛', '昆明', '苏州', '杭州', '南京', '重庆', '香港', '澳门', '台北'],
                'external': ['首尔', '东京', '济州岛', '大阪', '曼谷', '普吉岛', '吉隆坡', '巴厘岛', '长滩岛', '伦敦', '悉尼', '巴黎', '纽约', '洛杉矶']
            },
            keys = [],

            titleEles, letterEles, handler = $ionicScrollDelegate.$getByHandle('scrollContent'),
            posArr, letterPosArr,
            cityModelStr = window.localStorage.getItem('GS_FOODS_CityModel'),
            cityModel,
            initModel = function (cm) {
                cityModel = cm;
                $scope.internal = cityModel.internal;
                $scope.external = cityModel.external;

                // 创建目的地列表的DOM结构
                var internalFrg = constructListDom(cityModel.internal, true),
                    externalFrg = constructListDom(cityModel.external, false);
                window.document.getElementById('internalWrapper').appendChild(internalFrg);
                window.document.getElementById('externalWrapper').appendChild(externalFrg);

                $timeout(function () {
                    initPos();
                }, 0);
            },
            constructListDom = function (list, isInternal) {
                var frg = window.document.createDocumentFragment(),
                    cities, city, wrapper, header, content, j, keyLen, i, len,
                    callBackFun = function (id, name) {
                        return function () {
                            $scope.backMainPage(id, name);
                        };
                    };

                for (j = 0, keyLen = keys.length; j < keyLen; j++) {
                    cities = list[keys[j]];
                    if (!cities || !cities.length) {
                        continue;
                    }
                    wrapper = window.document.createElement('div');
                    wrapper.className = isInternal ? 'i-city' : 'e-city';

                    header = window.document.createElement('h2');
                    header.innerText = (keys[j] === '0' ? '热门城市' : keys[j]);
                    wrapper.appendChild(header);

                    for (i = 0, len = cities.length; i < len; i++) {
                        city = cities[i];
                        content = window.document.createElement('div');
                        content.className = 'city-item';
                        content.innerText = city.name;
                        content.onclick = callBackFun(city.dstrId, city.name);
                        wrapper.appendChild(content);
                    }
                    frg.appendChild(wrapper);
                }
                return frg;
            },
            initPos = function () { // 存储当前各字母标题的位置，以便滑动定位控件使用
                titleEles = window.document.querySelectorAll(($scope.tabIndex === 0 ? '.i-city' : '.e-city') + ' h2');
                letterEles = window.document.querySelectorAll('.slide-locate li');
                posArr = [];
                letterPosArr = [];
                var i, len;
                for (i = 0, len = titleEles.length; i < len; i++) {
                    posArr.push(titleEles[i].offsetTop);
                }
                for (i = 0, len = letterEles.length; i < len; i++) {
                    letterPosArr.push(getElementTop(letterEles[i]));
                }
                $scope.onScroll();
            },
            getElementTop = function (element) {
                var actualTop = element.offsetTop;
                var current = element.offsetParent;
                while (current !== null) {
                    actualTop += current.offsetTop;
                    current = current.offsetParent;
                }
                return actualTop;
            },
            getHotCityIdx = function (city) { // 根据定义好的热门城市列表，判断当前城市是否为热门城市
                var countryModel = (city.countryId <= 1) ? hotCities.internal : hotCities.external;
                for (var i = 0, len = countryModel.length; i < len; i++) {
                    if (countryModel[i] === city.name) {
                        return i;
                    }
                }
                return -1;
            };

        // 初始化key数据，用于排序
        keys.push('0');
        for (var i = 'A'.charCodeAt(0), len = 'Z'.charCodeAt(0); i <= len; i++) {
            keys.push(String.fromCharCode(i));
        }

        $scope.switchTab = function (idx) {
            $scope.tabIndex = idx;
            $ionicScrollDelegate.$getByHandle('scrollContent').scrollTop();
            $timeout(function () {
                initPos();
            }, 0);
        };

        if (!cityModelStr) {
            $http.get('http://m.ctrip.com/restapi/you/home/getdistrict').success(function (cityInfo) {
                var cities = cityInfo.cities,
                    cityModel = {
                        'internal': {},
                        'external': {}
                    },
                    countryModel, city;
                if (cities && cities.length > 0) {
                    cities.sort(function (a, b) {
                        return a.name.localeCompare(b.name);
                    });

                    for (var i = 0, len = cities.length; i < len; i++) {
                        city = cities[i];
                        // 内陆countryId === 1，港澳台countryId === 0
                        countryModel = (city.countryId <= 1) ? cityModel.internal : cityModel.external;

                        // 热门城市(用'0'作为key是为了方便遍历排序), 数据里的热门城市（city.flag===1）并不符合我们的需求，因此在JS中定义好热门城市
                        if (!city.flag) { // 忽略数据里定义的热门城市
                            var hotCityIdx = getHotCityIdx(city);
                            if (hotCityIdx > -1) {
                                if (!countryModel['0']) {
                                    countryModel['0'] = [];
                                }
                                countryModel['0'][hotCityIdx] = city;
                            }
                            if (!countryModel[city.initial]) {
                                countryModel[city.initial] = [];
                            }
                            countryModel[city.initial].push(city);
                        }
                    }
                    window.localStorage.setItem('GS_FOODS_CityModel', JSON.stringify(cityModel));
                    initModel(cityModel);
                }
            });
        } else {
            initModel(JSON.parse(cityModelStr));
        }

        $geo.getInfo(function (geo) {
            Util.safeApply($scope, function () {
                $scope.CurrentDest.id = geo.cityId;
                $scope.CurrentDest.name = geo.cityName;
                $scope.CurrentDest.lat = geo.lat;
                $scope.CurrentDest.lon = geo.lon;
            });
        }, function () {
            Util.safeApply($scope, function () {
                $scope.CurrentDest.name = '暂时无法定位，请手动选择城市';
            });
        });

        $scope.onSearch = function () {
            $scope.searching = true;
        };

        $scope.clearSearch = function () {
            $scope.searchObj = {};
        };

        $scope.doSearchBack = function () {
            $scope.searching = false;
            $scope.searchObj = {};
        };

        $scope.onInput = function () {
            $http.get('http://m.ctrip.com/restapi/you/SearchApi/GetLenovo?pageindex=1&pagesize=20&searchtype=1&keyword=' + $scope.searchObj.key).success(function (respObj) {
                var list = [];
                if (respObj && respObj.districts) {
                    for (var i = 0, len = respObj.districts.length; i < len; i++) {
                        list.push({
                            'id': respObj.districts[i].Id,
                            'name': respObj.districts[i].Name
                        });
                    }
                }
                $scope.searchObj.list = list;
                $ionicScrollDelegate.$getByHandle('searchScroll').scrollTop();
            }).error(function () {
                $scope.searchObj.list = [];
            });
        };

        $scope.onKeydown = function (e) {
            if (e && e.keyCode === 13) { // 敲击键盘上的 “回车”键
                e.target.blur();
            }
        };

        $scope.onScroll = function () {
            Util.stickyTopScroll($scope, $compile, titleEles, handler);
        };

        $scope.sliderTouchMove = function (event) {
            console.log(1);
            var idx, i, len;
            for (i = 0, len = letterPosArr.length; i < len; i++) {
                if (event.touches[0].pageY < letterPosArr[i]) {
                    break;
                }
            }
            idx = (i === 0) ? 0 : i - 1;
            handler.scrollTo(0, posArr[letterEles[idx].getAttribute('idx')] || 0);
        };

        $scope.backMainPage = function (viewDestId, viewDestName) {
            if (viewDestId) {
                window.sessionStorage.setItem('ViewDestId', viewDestId);
                window.sessionStorage.setItem('ViewDestName', viewDestName);
                $scope.goBack();
                // window.location.href = '#/foods/home?ViewDestId=' + viewDestId + '&ViewDestName=' + viewDestName;
            }
        };

        $scope.goBack = function () {
            var navView = window.document.querySelector('ion-nav-view'),
                view = angular.element(window.document.querySelector('ion-view'));

            navView.classList.add('slide-bottom-top');
            $timeout(function () {
                navView.classList.remove('slide-bottom-top');
                view.remove();
            }, 1300);
            window.history.back();
        };
    });