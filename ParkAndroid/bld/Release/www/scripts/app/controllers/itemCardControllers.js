(function () {
    'use strict';

    angular.module("parkGorkogo.controllers.info", [
        'ui.router',
        'ui.bootstrap',
        'utf8-base64',
        'ngStorage',
         '720kb.socialshare',
         'ngSanitize'
    ])
    .controller('itemCardController',
                function ($scope, $state, $stateParams, $http, $localStorage, base64, httpService, $timeout, sharedProperties) {

                   var w = window,
                   d = document,
                   e = d.documentElement,
                   g = d.getElementsByTagName('body')[0],
                   y = w.innerHeight || e.clientHeight || g.clientHeight;
                   $scope.myHeight = Math.round(y / 2.66) + "px";
                   
                  

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

                    $scope.mapImage = true; // условие показа картинки перехода на карту

                    // инициализация попап окна для поделиться новостью
                    $scope.dynamicPopover = {
                        templateUrl: 'mySocialTemplate.html',
                        title: 'Поделиться:'
                    };

                    $scope.InfoSlides = []; // инициализация слайдера


                    // если на предудыщем шаге был интернет
                    if ($stateParams.noInternet == false) {
                        

                        if ($stateParams.fromMap == true) {
                            $scope.mapImage = false; // убираем показа картинки перехода на карту
                        }                        

                                               
                        if ($stateParams.error == true) {
                            var url = 'content/images/park.png';
                            var object = { image: url };
                            $scope.InfoSlides.push(object);
                        }
                        else {
                            // формирование массива картинок для слайдера
                            angular.forEach($stateParams.selectedElement.img_links, function (image) {
                                var object = { image: base64.decode(image) };
                                $scope.InfoSlides.push(object);
                            });

                        }
                        
                        

                        // формируем информационные поля 
                        $scope.name = base64.decode($stateParams.selectedElement.name); // Название                        
                        if ($stateParams.selectedElement.price) {
                            $scope.price = base64.decode($stateParams.selectedElement.price); // Цена если указанна
                        }
                        $scope.desc = base64.decode($stateParams.selectedElement.desc); // Описание
                        $scope.desc = $scope.desc.replace(/(\r\n|\n|\r)/gm, "<br>");
                        
                    }
                    // если на предудущем шаге интернета небыло
                    else {

                        if ($stateParams.fromMap == true) {
                            $scope.mapImage = false; // убираем показа картинки перехода на карту
                        }

                        // формируем заглушку для слайдера
                        var url = 'content/images/park.png';                        
                        var object = { image: url };
                        $scope.InfoSlides.push(object);

                        // формируем информационные поля 
                        $scope.name = $stateParams.selectedElement.object.name;
                        $scope.price = $stateParams.selectedElement.object.price;
                    }

                    // функция перехода назад, инициализируется пользователем
                    $scope.returnBack = function () {
                        switch (true) {
                            case ($stateParams.fromFood && !$stateParams.fromMap):
                                $state.go('foodSecondMenu', {
                                    'selectedTag': $stateParams.tag
                                })
                                break;
                            case ($stateParams.fromAttractions && !$stateParams.fromMap):
                                $state.go('attractionsSecondMenu', {
                                    'selectedTag': $stateParams.tag
                                });
                                break;
                            case ($stateParams.fromHome || $stateParams.fromMap):
                                $state.go('map', {
                                    'selectedItem': $stateParams.firstSelectedElement,
                                    'noInternet': $stateParams.noInternet,
                                    'tag': $stateParams.tag,
                                    'fromFood': $stateParams.fromFood,
                                    'fromAttractions': $stateParams.fromAttractions,
                                    'fromHome': $stateParams.fromHome,
                                    'fromMap': $stateParams.fromMap,
                                    'firstSelectedElement': $stateParams.firstSelectedElement,
                                    'error': $stateParams.error
                                });
                                break;
                        }                                              
                    }


                    // функция перехода на карту, принимает элемент переданный с предыдущего шага
                    $scope.returnMap = function () {                        
                        $state.go('map', { 
                            'selectedItem': $stateParams.selectedElement,
                            'noInternet': $stateParams.noInternet,
                            'tag': $stateParams.tag,
                            'fromFood': $stateParams.fromFood,
                            'fromAttractions': $stateParams.fromAttractions,
                            'fromHome': false,
                            'firstSelectedElement': $stateParams.selectedElement,
                            'error': $stateParams.error
                        });                        
                    }


                })


})();