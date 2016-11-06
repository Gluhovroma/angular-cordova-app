

(function () {
    'use strict';
    angular.module('parkGorkogo', [
        'parkGorkogo.controllers.main',
        'parkGorkogo.controllers.home',
        'parkGorkogo.controllers.attraction',
        'parkGorkogo.controllers.food',
        'parkGorkogo.controllers.news',
        'parkGorkogo.controllers.events',
        'parkGorkogo.controllers.map',
        'parkGorkogo.controllers.about',
        'parkGorkogo.controllers.info',
        'parkGorkogo.services'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'partials/partial-home.html',
                controller: 'homeController'
            })
            .state('attractionsFirstMenu', {
                templateUrl: 'partials/partial-attractionsFirstMenu.html',
                controller: 'attractionsFirstMenuController'
            })
            .state('attractionsSecondMenu', {
                params: { selectedTag: null },
                templateUrl: 'partials/partial-attractionsSecondMenu.html',
                controller: 'attractionsSecondMenuController'
            })
            .state('itemCard', {
                params: {
                    selectedElement: null,
                    noInternet: false,
                    tag: null,
                    fromFood: false,
                    fromAttractions: false,
                    fromHome: false,
                    fromMap: false,
                    firstSelectedElement: null,
                    error: false

                },
                templateUrl: 'partials/partial-itemCard.html',
                controller: 'itemCardController'
            })
            .state('foodFirstMenu', {               
                templateUrl: 'partials/partial-foodFirstMenu.html',
                controller: 'foodFirstMenuController'
            })
            .state('foodSecondMenu', {
                params: {
                    selectedTag: null
                },
                templateUrl: 'partials/partial-foodSecondMenu.html',
                controller: 'foodSecondMenuController'
            })            
            .state('newsMenu', {                
                templateUrl: 'partials/partial-newsMenu.html',
                controller: 'newsMenuController'
            })
            .state('newsInfo', {
                params: {
                    selectedNews: null,
                    noInternet: null
                },
                templateUrl: 'partials/partial-newsInfo.html',
                controller: 'newsInfoController'
            })
            .state('eventsCalendar', {               
                templateUrl: 'partials/partial-eventsCalendar.html',
                controller: 'eventsCalendarController'
            })
            .state('eventsList', {
                params: {
                    selectedDate: null
                },
                templateUrl: 'partials/partial-eventsList.html',
                controller: 'eventsListController'
            })
             .state('eventsInfo', {
                 params: {
                     selectedEvents: null,
                     noInternet: null,
                     selectedDate: null
                 },
                 templateUrl: 'partials/partial-eventsInfo.html',
                 controller: 'eventsInfoController'
             })
            .state('map', {
                params: {
                    selectedItem: null,
                    noInternet: false,
                    tag: null,
                    fromFood: false,
                    fromAttractions: false,
                    fromHome: false,
                    fromMap: false,
                    firstSelectedElement: null,
                    error: false
                },
                templateUrl: 'partials/partial-map.html',
                controller: 'mapController'
            })
            .state('about', {                
                templateUrl: 'partials/partial-about.html',
                controller: 'aboutController'
            })
            .state('direction', {                
                templateUrl: 'partials/partial-direction.html',
                controller: 'directionController'
            })
            .state('directionOnMap', {                
                templateUrl: 'partials/partial-directionOnMap.html',
                controller: 'directionOnMapController'
            })
    });

    

})();
