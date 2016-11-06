(function () {
    'use strict';

    angular.module("CaseStudio.controllers.main", [
        'ui.router',
        'ui.bootstrap',
        'utf8-base64',
        'ngStorage'
    ])
        .controller('mainController',
            function ($scope, $state, $stateParams, $http, base64, httpService, $localStorage, sharedProperties, pushService) {
                pushService.pushInit();
                
                function appGo() {
                    if (!$localStorage.userGuid22) {
                        
                        httpService
                            .getUserGuid()
                            .success(function (data, status, headers, config) {
                                $localStorage.userGuid22 = data.token;
                                /////////////////////////  получаем фотографии для слайдера ///////////////////////////////////
                                $scope.slides = [];
                                $scope.myInterval = 3000;
                                httpService
                                    .getStartPhotos()
                                    .success(function (data, status, headers, config) {
                                        
                                        angular.forEach(data, function (dataItem) {
                                            var object = { image: base64.decode(dataItem.slide_img) };
                                            $scope.slides.push(object);
                                        });
                                    });
                                ///////////////////////////////////////////////////////////////////////////////////////////////////                                                               
                                sharedProperties.updateAttractionsTable();
                                sharedProperties.updateFoodTable();
                                sharedProperties.updateNewsTable();
                                sharedProperties.updateEventsTable();
                                var a = {};
                                a['start'] = 'start';
                                $localStorage.itemCard = a;                               
                                $localStorage.eventsCard = a;
                                $localStorage.internet = true;
                            })
                            .error(function () {
                                
                                var url = 'content/images/park.png';
                                $scope.slides = [];
                                var object = { image: url };
                                $scope.slides.push(object);
                                $localStorage.internet = false;
                                // здесь нужно поставить ошибку подключения к интернету или не надо
                            });
                    }
                    else {
                        
                        $scope.slides = [];
                        $scope.myInterval = 3000;
                        if (!$localStorage.eventsCard) {
                            var a = {};
                            a['start'] = 'start';
                            $localStorage.itemCard = a; 
                        }
                        if (!$localStorage.eventsCard) {
                            var a = {};
                            a['start'] = 'start';                                                          
                            $localStorage.eventsCard = a;
                        }
                        httpService
                            .getStartPhotos()
                            .success(function (data, status, headers, config) {
                                angular.forEach(data, function (dataItem) {
                                    var object = { image: base64.decode(dataItem.slide_img) };
                                    $scope.slides.push(object);
                                });
                                sharedProperties.updateAttractionsTable();
                                sharedProperties.updateFoodTable();
                                sharedProperties.updateNewsTable();
                                sharedProperties.updateEventsTable();
                                sharedProperties.deleteEvents();
                                $localStorage.internet = true;
                            })
                            .error(function () {
                                sharedProperties.deleteEvents();
                                // здесь нужно поставить заглушку на фотографии
                                var url = 'content/images/park.png';
                                $scope.slides = [];
                                var object = { image: url };
                                $scope.slides.push(object);
                                $localStorage.internet= false;
                            });
                    }
                };
                appGo();
                var w = window,
               d = document,
               e = d.documentElement,
               g = d.getElementsByTagName('body')[0],
               y = w.innerHeight || e.clientHeight || g.clientHeight;
                $scope.divHeight = y + "px";
                console.log($scope.divHeight);
            })
})();