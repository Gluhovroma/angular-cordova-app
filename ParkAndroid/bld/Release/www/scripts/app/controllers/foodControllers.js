(function () {
    'use strict';

    angular.module("parkGorkogo.controllers.food", [
        'ui.router',
        'ui.bootstrap',
        'utf8-base64',
        'ngStorage',
        'ngSanitize'
    ])
            .controller('foodFirstMenuController',
                function ($scope, $state, $stateParams, $http, $localStorage, base64) {

                    function onBackKeyDown(evt) {
                        evt.preventDefault();
                        evt.stopPropagation();
                        $state.go('home');
                    }

                    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

                    function onDeviceReady() {                                    
                        document.addEventListener("backbutton", onBackKeyDown, false);                        
                    };                  


                    $scope.foodTags = {};
                    var classCounter = 1;
                    var foodTable = $localStorage.FoodTable;


                    angular.forEach(foodTable, function (foodItem) {
                        var a = foodItem.tags.split(',');
                        angular.forEach(a, function (item) {
                            if (item != "") {
                                if (!$scope.foodTags[item.toLowerCase().replace(/\s+/g, '')]) {
                                    item = item.replace(/(^\s+|\s+$)/g, '').replace(/ {1,}/g, " ");
                                    item = item.charAt(0).toUpperCase() + item.substr(1).toLowerCase();
                                    $scope.foodTags[item.toLowerCase().replace(/\s+/g, '')] = {
                                        'value': item.charAt(0).toUpperCase() + item.substr(1).toLowerCase(),                                        
                                        'class': 'attractionElem' + classCounter
                                    };
                                    if (classCounter < 6) {
                                        classCounter++;
                                    }
                                    else {
                                        classCounter = 1;
                                    }
                                }
                            }
                        })
                    });
                    if (!foodTable) {
                        $scope.foodTags["error"] = {
                            'value': 'Отсутствует подключение к интернету',
                            'class': 'attractionElem0'
                        };                       
                    }
                    else {
                        $scope.foodTags["явсе"] = {
                            'value': 'Все',
                            'class': 'attractionElem0'
                        };
                    };
                    
                    $scope.returnFoodSecondMenu = function (item) {
                        var a = item.value.toLowerCase().replace(/\s+/g, '');
                        console.log(item);
                        $state.go('foodSecondMenu', { 'selectedTag': item.value });

                    }
                    $scope.returnMainMenu = function () {
                        $state.go('home');
                    };
                    
                })
    .controller('foodSecondMenuController',
            function ($scope, $state, $stateParams, $http, $localStorage, base64, httpService) {

                function onBackKeyDown(evt) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    $state.go('foodFirstMenu');
                }

                document.addEventListener('deviceready', onDeviceReady.bind(this), false);

                function onDeviceReady() {
                                     
                    document.addEventListener("backbutton", onBackKeyDown, false);
                    
                };


                var foodTable = $localStorage.FoodTable;
                $scope.selectedTag = $stateParams.selectedTag; // заголовок меню               
                $scope.foodElements = [];
                console.log(foodTable);
                console.log($scope.selectedTag);
                if ($scope.selectedTag == "Все") {
                    var counter = 0;
                    angular.forEach(foodTable, function (foodItem) {
                        if (counter == 0) {
                            var newElement = {
                                'class': 'foodSecondMenu' + counter,
                                'object': foodItem
                            }
                            $scope.foodElements.push(newElement);
                            counter++;
                        }
                        else {
                            var newElement = {
                                'class': 'foodSecondMenu' + counter,
                                'object': foodItem
                            }
                            $scope.foodElements.push(newElement);
                            counter--;
                        }
                    });
                }
                else {
                    var counter = 0;
                    angular.forEach(foodTable, function (foodItem) {
                        var a = foodItem.tags.split(',');
                        angular.forEach(a, function (item) {
                            if (item.toLowerCase().replace(/\s+/g, '') == $scope.selectedTag.toLowerCase().replace(/\s+/g, '')) {
                                if (counter == 0) {
                                    var newElement = {
                                        // поменять оформление
                                        'class': 'foodSecondMenu' + counter,
                                        'object': foodItem
                                    }
                                    $scope.foodElements.push(newElement);
                                    counter++;
                                }
                                else {
                                    var newElement = {
                                        'class': 'foodSecondMenu' + counter,
                                        'object': foodItem
                                    }
                                    $scope.foodElements.push(newElement);
                                    counter--;
                                }
                            }
                        });
                    });
                }

                $scope.returnFoodInfo = function (item) {
                    httpService
                        .getCardInfo(item.object.guid_elem)
                        .success(function (data, status, headers, config) {
                            $localStorage.itemCard[item.object.guid_elem] = data;
                            $state.go('itemCard', {
                                'selectedElement': data,
                                'noInternet': false,
                                'tag': $scope.selectedTag,
                                'fromFood': true,
                                'fromAttractions': false,
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
                                    'fromFood': true,
                                    'fromAttractions': false,
                                    'fromMap': false,
                                    'error': true
                                });
                            }
                            else {
                                $state.go('itemCard', {
                                    'selectedElement': item,
                                    'noInternet': true,
                                    'tag': $scope.selectedTag,
                                    'fromFood': true,
                                    'fromAttractions': false,
                                    'fromMap': false,
                                    'error': true
                                });
                            }
                            
                        });
                };
                $scope.returnFoodFirstMenu = function () {
                    $state.go('foodFirstMenu');
                };
            })
            

})();