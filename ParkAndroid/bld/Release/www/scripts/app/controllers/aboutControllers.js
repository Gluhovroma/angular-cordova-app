(function () {
    'use strict';

    angular.module("parkGorkogo.controllers.about", [
        'ui.router',
        'ui.bootstrap',
        'utf8-base64',
        'ngStorage'
    ])
    .controller('aboutController', function ($scope, $state, $stateParams, $http, base64, httpService, $localStorage, sharedProperties) {

        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            y = w.innerHeight || e.clientHeight || g.clientHeight;
        $scope.myHeight = Math.round(y / 2.66) + "px";

        function onBackKeyDown(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            $state.go('home')
        }

        document.addEventListener('deviceready', onDeviceReady.bind(this), false);

        function onDeviceReady() {
            // Handle the Cordova pause and resume events                    
            document.addEventListener("backbutton", onBackKeyDown, false);
            // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        };

        $scope.returnDirection = function () {
            $state.go('direction');
        }

        $scope.returnMainMenu = function () {
            $state.go('home');
        }
    })
    .controller('directionController', function ($scope, $state, $stateParams, $http, base64, httpService, $localStorage, sharedProperties) {
        function onBackKeyDown(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            $state.go('about');
        }

        document.addEventListener('deviceready', onDeviceReady.bind(this), false);

        function onDeviceReady() {
            // Handle the Cordova pause and resume events                    
            document.addEventListener("backbutton", onBackKeyDown, false);
            // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        };

        $scope.internet = $localStorage.internet;
        $scope.returnAbout = function () {
            $state.go('about');
        }
        $scope.returnDirectionOnMap = function () {
            $state.go('directionOnMap');
        }

    })
    .controller('directionOnMapController', function ($scope, $state, $stateParams, $http, base64, httpService, $localStorage) {

        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
        y = w.innerHeight || e.clientHeight || g.clientHeight;
        $scope.myHeight = (y - 90) + "px";
        
        function onBackKeyDown(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            $state.go('direction');
        }

        document.addEventListener('deviceready', onDeviceReady.bind(this), false);

        function onDeviceReady() {
            // Handle the Cordova pause and resume events                    
            document.addEventListener("backbutton", onBackKeyDown, false);
            // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        };
        $scope.returnDirection = function () {
            $state.go('direction');
        }

    })


})();