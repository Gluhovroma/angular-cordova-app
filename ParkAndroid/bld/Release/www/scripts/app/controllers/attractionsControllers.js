(function () {
    'use strict';

    angular.module("parkGorkogo.controllers.attraction", [
        'ui.router',
        'ui.bootstrap',
        'utf8-base64',
        'ngStorage',
        'ngSanitize'
    ])        
    .controller('attractionsFirstMenuController',
        function ($scope, $state, $stateParams, $http, $localStorage, base64) {
            
            // функция клика на нативную кнопку назад
            function onBackKeyDown(evt) {
                evt.preventDefault();
                evt.stopPropagation();
                $state.go('home');
            };
            // подписываемся на событие deviceready
            document.addEventListener('deviceready', onDeviceReady.bind(this), false);
            // как только устройство готово, подписываемся на событие клика на нативную кнопку назад
            function onDeviceReady() {                                  
                document.addEventListener("backbutton", onBackKeyDown, false);                
            };

            $scope.attractionsTags = {};
            var classCounter = 1;
            var attractionsTable = $localStorage.AttractionsTable;            
            
            angular.forEach(attractionsTable, function (attractionItem) {
                var a = attractionItem.tags.split(',');
                angular.forEach(a, function (item) {
                    if (item != "") {
                        if (!$scope.attractionsTags[item.toLowerCase().replace(/\s+/g, '')]) {
                            item = item.replace(/(^\s+|\s+$)/g, '').replace(/ {1,}/g, " ");
                            item = item.charAt(0).toUpperCase() + item.substr(1).toLowerCase();
                            $scope.attractionsTags[item.toLowerCase().replace(/\s+/g, '')] = {
                                'value': item.charAt(0).toUpperCase() + item.substr(1).toLowerCase(),
                                'class': 'attractionElem' + classCounter
                            };
                            if (classCounter < 6) {
                                classCounter++;
                            }
                            else {
                                classCounter = 1;
                            };
                        };
                    };
                });
            });
            
            if (!attractionsTable) {

                $scope.attractionsTags["error"] = {
                    'value': 'Отсутствует подключение к интернету',
                    'class': 'attractionElem0'
                };
            }
            else {
                $scope.attractionsTags["явсе"] = {
                    'value': 'Все',
                    'class': 'attractionElem0'
                };
            };

            // функция перехода на следующий уровень меню
            $scope.returnAttractionsSecondMenu = function (item) {
                var a = item.value.toLowerCase().replace(/\s+/g, '');
                $state.go('attractionsSecondMenu', { 'selectedTag': item.value });
            };
            // функция возвращения в главное меню
            $scope.returnMainMenu = function () {
                $state.go('home');
            };
    })
        .controller('attractionsSecondMenuController', 
            function ($scope, $state, $stateParams, $http, $localStorage, base64, httpService) {

                function onBackKeyDown(evt) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    $state.go('attractionsFirstMenu');
                }

                document.addEventListener('deviceready', onDeviceReady.bind(this), false);

                function onDeviceReady() {
                    // Handle the Cordova pause and resume events                    
                    document.addEventListener("backbutton", onBackKeyDown, false);
                    // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
                };

                $scope.selectedTag = $stateParams.selectedTag; // заголовок меню               
                var attractionsTable = $localStorage.AttractionsTable;
                $scope.attractionElements = [];
                if ($scope.selectedTag == "Все") {
                    var counter = 0;
                    angular.forEach(attractionsTable, function (attractionItem) {
                        if (counter == 0) {
                            var newElement = {
                                'class': 'attractionSecondMenu' + counter,
                                'object': attractionItem
                            }
                            $scope.attractionElements.push(newElement);
                            counter++;
                        }
                        else {
                            var newElement = {
                                'class': 'attractionSecondMenu' + counter,
                                'object': attractionItem
                            }
                            $scope.attractionElements.push(newElement);
                            counter--;
                        }
                    })
                    console.log($scope.attractionElements);
                }
                else {
                    var counter = 0;
                    angular.forEach(attractionsTable, function (attractionItem) {
                        var a = attractionItem.tags.split(',');
                        angular.forEach(a, function (item) {
                            if (item.toLowerCase().replace(/\s+/g, '') == $scope.selectedTag.toLowerCase().replace(/\s+/g, '')) {
                                if (counter == 0) {
                                    var newElement = {
                                        'class': 'attractionSecondMenu' + counter,
                                        'object': attractionItem
                                    }
                                    $scope.attractionElements.push(newElement);
                                    counter++;
                                }
                                else {
                                    var newElement = {
                                        'class': 'attractionSecondMenu' + counter,
                                        'object': attractionItem
                                    }
                                    $scope.attractionElements.push(newElement);
                                    counter--;
                                }
                            }
                        });
                    });
                }

                $scope.returnAttractionInfo = function (item) {
                    httpService
                        .getCardInfo(item.object.guid_elem)
                        .success(function (data, status, headers, config) {
                           
                            console.log($localStorage.itemCard);
                            console.log(data);
                            $localStorage.itemCard[item.object.guid_elem] = data;
                            $state.go('itemCard', {
                                'selectedElement': data,
                                'noInternet': false,
                                'tag': $scope.selectedTag,
                                'fromFood': false,
                                'fromAttractions': true,
                                'fromMap': false,
                                'error': false
                                
                            });
                        })
                        .error(function () {                            
                            
                            if ($localStorage.itemCard[item.object.guid_elem]) {
                                
                                $state.go('itemCard', {
                                    'selectedElement': $localStorage.itemCard[item.object.guid_elem],
                                    'noInternet': false,
                                    'tag': $scope.selectedTag,
                                    'fromFood': false,
                                    'fromAttractions': true,
                                    'fromMap': false,
                                    'error': true
                                });
                            }
                            else {
                                $state.go('itemCard', {
                                    'selectedElement': item,
                                    'noInternet': true,
                                    'tag': $scope.selectedTag,
                                    'fromFood': false,
                                    'fromAttractions': true,
                                    'fromMap': false,
                                    'error': true
                                });
                            }
                        });
                };
                $scope.returnAttractionsFirstMenu = function () {
                    $state.go('attractionsFirstMenu');
                };
            })
})();