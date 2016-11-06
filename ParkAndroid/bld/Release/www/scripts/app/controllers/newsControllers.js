(function () {
    'use strict';

    angular.module("parkGorkogo.controllers.news", [
        'ui.router',
        'ui.bootstrap',
        'utf8-base64',
        'ngStorage',
        'ngSanitize'
    ])
    .controller('newsMenuController', function ($scope, $state, $stateParams, $http, base64, httpService, $localStorage, sharedProperties) {

        function onBackKeyDown(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            $state.go('home');
        }
        document.addEventListener('deviceready', onDeviceReady.bind(this), false);
        function onDeviceReady() {                            
            document.addEventListener("backbutton", onBackKeyDown, false);            
        };

        if (!$localStorage.userGuid22) {
            sharedProperties.getUserGuid();
        };
        
        httpService
            .getNewsTable()
            .success(function (data, status, headers, config) {
                
                var newDataArray = [];
                for (var i = data.length; i > 0 ; i--) {                    
                    data[i-1].name = base64.decode(data[i - 1].name);
                    newDataArray.push(data[i-1]);
                    
                }                
                $localStorage.NewsTable = newDataArray;
                $scope.newsElements = [];
                var counter = 0;
                var newsTable = newDataArray;
                
                
                $scope.newsElements = [];                
                angular.forEach(newsTable, function (newsItem) {
                    if (counter == 0) {
                        var newElement = {
                            'class': 'attractionSecondMenu' + counter,
                            'object': newsItem
                        }
                        $scope.newsElements.push(newElement);
                        counter++;
                    }
                    else {
                        var newElement = {
                            'class': 'attractionSecondMenu' + counter,
                            'object': newsItem
                        }
                        $scope.newsElements.push(newElement);
                        counter--;
                    }
                });
            })
        .error(function () {
            var newsTable = $localStorage.NewsTable;
            
            $scope.newsElements = [];
            var counter = 0;
            angular.forEach(newsTable, function (newsItem) {
                if (counter == 0) {
                    var newElement = {
                        'class': 'attractionSecondMenu' + counter,
                        'object': newsItem
                    }
                    $scope.newsElements.push(newElement);
                    counter++;
                }
                else {
                    var newElement = {
                        'class': 'attractionSecondMenu' + counter,
                        'object': newsItem
                    }
                    $scope.newsElements.push(newElement);
                    counter--;
                }
            });
        })
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!здесь надо вызвать сервис, который обновит остальные таблицы
        sharedProperties.updateAttractionsTable();
        sharedProperties.updateFoodTable();
        sharedProperties.updateEventsTable();
            
        $scope.returnNewsInfo = function (item) {
            console.log(item);
            httpService
                .getNewsInfo(item.object.guid_elem)
                .success(function (data, status, headers, config) {                    
                    $state.go('newsInfo', { 'selectedNews': data, 'noInternet': false});
                })
                .error(function () {                    
                    $state.go('newsInfo', { 'selectedNews': item, 'noInternet': true});
                });
        };
        $scope.returnMainMenu = function () {
            $state.go('home');
        };                                   
    })
    .controller('newsInfoController', function ($scope, $state, $stateParams, $http, base64, httpService, $localStorage) {

        // инициализация высоты слайдера
        var w = window,
                   d = document,
                   e = d.documentElement,
                   g = d.getElementsByTagName('body')[0],
                   y = w.innerHeight || e.clientHeight || g.clientHeight;
        $scope.myHeight = Math.round(y / 2.66) + "px";
        $scope.descriptionHeight = y - Math.round(y / 2.66) - 74 + "px";

        function onBackKeyDown(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            $state.go('newsMenu');
        }
        document.addEventListener('deviceready', onDeviceReady.bind(this), false);
        function onDeviceReady() {                               
            document.addEventListener("backbutton", onBackKeyDown, false);            
        };
        $scope.newsInfoSlides = [];
        if ($stateParams.noInternet == false) {           
            angular.forEach($stateParams.selectedNews.img_links, function (image) {
                var object = { image: base64.decode(image) };
                $scope.newsInfoSlides.push(object);
            });
            $scope.name = base64.decode($stateParams.selectedNews.name);
            $scope.desc = base64.decode($stateParams.selectedNews.desc);
            $scope.desc = $scope.desc.replace(/(\r\n|\n|\r)/gm, "<br>");
        }
        else {            
            var url = 'content/images/park.png';            
            var object = { image: url };
            $scope.newsInfoSlides.push(object);
            $scope.name = $stateParams.selectedNews.object.name;            
        }
        $scope.returnNewsMenu = function () {
            $state.go('newsMenu');
        }
    })

                
})();