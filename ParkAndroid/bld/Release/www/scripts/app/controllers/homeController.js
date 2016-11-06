(function () {
    'use strict';

    angular.module("parkGorkogo.controllers.home", [
        'ui.router',
        'ui.bootstrap',
        'utf8-base64',
        'ngStorage',
        'angular-carousel'
    ])
        .controller('homeController',
            function ($scope, $state, $stateParams, $http, base64, httpService, $localStorage, sharedProperties) {
               var w = window,
               d = document,
               e = d.documentElement,
               g = d.getElementsByTagName('body')[0],
               y = w.innerHeight || e.clientHeight || g.clientHeight;
               
                $scope.myHeight = Math.round(y / 2.66) + "px";
                $scope.divHeight = y+ "px";
               
                $scope.showMeCondition = true;
                function onBackKeyDown(evt) {
                    evt.preventDefault();
                    evt.stopPropagation();                    
                    if ($state.current.name == "home") {
                        navigator.app.exitApp();
                        }                  
                }
                document.addEventListener('deviceready', onDeviceReady.bind(this), false);
                function onDeviceReady() {                                    
                    document.addEventListener("backbutton", onBackKeyDown, false);                    
                };                

                $scope.returnAttractionsFirstMenu = function () {
                    $state.go('attractionsFirstMenu');
                };

                $scope.returnFoodFirstMenu = function () {
                    $state.go('foodFirstMenu');                    
                };

                $scope.returnEvents = function () {
                    $state.go('eventsCalendar');                                             
                };

                $scope.returnNewsMenu = function () {                    
                    $state.go('newsMenu');                    
                };

                $scope.returnAbout = function () {
                    $state.go('about');                    
                };

                $scope.returnMap = function () {                                     
                    $state.go('map', {
                        'selectedItem': null,
                        'tag': null,
                        'fromFood': false,
                        'fromAttractions': false,
                        'fromHome': true
                    });
                };
                $scope.showMe = function () {                    
                    if ($scope.showMeCondition == true) {
                        $scope.showMeCondition = false;
                    }
                    else {
                        $scope.showMeCondition = true;
                    }
                }
            })
})();