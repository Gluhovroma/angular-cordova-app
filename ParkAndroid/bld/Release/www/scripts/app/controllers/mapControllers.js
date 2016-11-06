(function () {
    'use strict';

    angular.module("parkGorkogo.controllers.map", [
        'ui.router',
        'ui.bootstrap',        
        'ngStorage'
    ])
    .controller('mapController', function ($scope, $compile, $state, $stateParams, httpService, $localStorage, sharedProperties) {       
        function onBackKeyDown(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            $scope.returnBack();
        }
        document.addEventListener('deviceready', onDeviceReady.bind(this), false);
        function onDeviceReady() {
            // Handle the Cordova pause and resume events                    
            document.addEventListener("backbutton", onBackKeyDown, false);
            // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        };        
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
        y = w.innerHeight || e.clientHeight || g.clientHeight;
        document.getElementById("map").style.height = (y - 75) + "px"; 
        // инициализируем все необходимые объекты из локального хранилища
        var a = $localStorage.AttractionsTable;
        var b = $localStorage.FoodTable;
        if (a != null && b != null) {
            var items = a.concat(b);
        }
        
        // красный маячок на карте(может быть null, если перешли из главного меню)       
       
            console.log(redItem);
            
            console.log(redItem);
            console.log($stateParams.fromHome);
            if ($stateParams.fromHome != true) {
                if ($stateParams.noInternet == false) {
                    var redItem = $stateParams.selectedItem;
                }
                else {
                    var redItem = $stateParams.selectedItem.object;
                }
            }
            if (redItem != null) {
            // инициализация карты
            if (redItem.coord_y != "" && redItem.coord_x != "") {

                var map = L.map('map', {
                    maxZoom: 9,
                    minZoom: 6,
                    crs: L.CRS.Simple
                });

                var a = map.unproject([redItem.coord_x, redItem.coord_y], map.getMaxZoom());
                map.setView([a["lat"], a["lng"]], 7);

                map.attributionControl.setPrefix('Парк Горького');               

            }
            else {
                var map = L.map('map', {
                    maxZoom: 9,
                    minZoom: 6,
                    crs: L.CRS.Simple
                });
                var a = map.unproject([2300, 1000], map.getMaxZoom());
                map.setView([a["lat"], a["lng"]], 7);
                map.attributionControl.setPrefix('Парк Горького');
            }            
        }
        else {
            var map = L.map('map', {
                        maxZoom: 9,
                        minZoom: 6,
                        crs: L.CRS.Simple
            });
            var a = map.unproject([2300, 1000], map.getMaxZoom());
            map.setView([a["lat"], a["lng"]], 7);
            map.attributionControl.setPrefix('Парк Горького');            
        }
        // инициализация юго-запаза и северо-востока
        var southWest = map.unproject([0, 2750], map.getMaxZoom());
        var northEast = map.unproject([4458, 0], map.getMaxZoom());
        // еще какая-то инициализация
        map.setMaxBounds(new L.LatLngBounds(southWest, northEast));
        L.tileLayer('sourse/{z}/tile-{x}-{y}.png', {
            attribution: 'Map data &copy; ???',
        }).addTo(map);        
        // перебор всех объектов для инициализации их на карте
        angular.forEach(items, function (dataItem) {
            if (dataItem.coord_x != "" && dataItem.coord_y != "") {
                var x = dataItem.coord_x;
                var y = dataItem.coord_y;               
                var name = dataItem.name;
                var html = '<div class="font"><span>' + name + '</span></br></br> <button class="btn" ng-click="returnItemInfo(object)">Подробнее</button></div>',
                linkFunction = $compile(angular.element(html)),
                newScope = $scope.$new();
                newScope.object = dataItem;
                              
                if (redItem != null && redItem.coord_x == x && redItem.coord_y == y) {

                    var RedIcon = L.Icon.Default.extend({
                        options: {
                            iconUrl: 'content/images/marker-icon-red.png'
                        }
                    });
                    var redIcon = new RedIcon();
                    L.marker(map.unproject([x, y], map.getMaxZoom()), { icon: redIcon })
                                      .addTo(map)
                                      .bindPopup(linkFunction(newScope)[0]);
                }                
                else {
                    L.marker(map.unproject([x, y], map.getMaxZoom()))
                                        .addTo(map)
                                        .bindPopup(linkFunction(newScope)[0]);
                }
            }                
        });
        
        // функция перехода на карточку объекта, вызывает пользователь в popup
        $scope.returnItemInfo = function (item) {            
            httpService
                        .getCardInfo(item.guid_elem)
                        .success(function (data, status, headers, config) {
                            $localStorage.itemCard[item.guid_elem] = data;
                            $state.go('itemCard', {
                                'selectedElement': data,
                                'noInternet': false,
                                'tag': $stateParams.tag,
                                'fromFood': $stateParams.fromFood,
                                'fromAttractions': $stateParams.fromAttractions,
                                'fromHome': $stateParams.fromHome,
                                'fromMap': true,
                                'firstSelectedElement': $stateParams.firstSelectedElement,
                                'error': false
                            });
                        })
                        .error(function () {
                            if ($localStorage.itemCard[item.guid_elem]) {
                                $state.go('itemCard', {
                                    'selectedElement': $localStorage.itemCard[item.guid_elem],
                                    'noInternet': false,
                                    'tag': $stateParams.tag,
                                    'fromFood': $stateParams.fromFood,
                                    'fromAttractions': $stateParams.fromAttractions,
                                    'fromHome': $stateParams.fromHome,
                                    'fromMap': true,
                                    'firstSelectedElement': $stateParams.firstSelectedElement,
                                    'error': true
                                });
                            }
                            else {
                                var newItem = { object: item };
                                $state.go('itemCard', {
                                    'selectedElement': newItem,
                                    'noInternet': true,
                                    'tag': $stateParams.tag,
                                    'fromFood': $stateParams.fromFood,
                                    'fromAttractions': $stateParams.fromAttractions,
                                    'fromHome': $stateParams.fromHome,
                                    'fromMap': true,
                                    'firstSelectedElement': $stateParams.firstSelectedElement
                                });
                            }             


                            
                        });
        }
        // функция возрата на предыдущий шаг (вызывается пользователем)
        $scope.returnBack = function () {
            switch (true) {
                // переходим на карточку элемента, если мы пришли из него
                case ($stateParams.fromFood || $stateParams.fromAttractions):
                    $state.go('itemCard', {
                        'selectedElement': $stateParams.firstSelectedElement,
                        'noInternet': $stateParams.noInternet,
                        'tag': $stateParams.tag,
                        'fromFood': $stateParams.fromFood,
                        'fromAttractions': $stateParams.fromAttractions,
                        'fromHome': $stateParams.fromHome,
                        'fromMap': false,
                        'firstSelectedElement': $stateParams.firstSelectedElement,
                        'error': $stateParams.error
                    })
                    break;
                //переходим в главное меню если пришли из него
                case $stateParams.fromHome:
                    $state.go('home');
                    break;
            }          
        };     
    })
})();