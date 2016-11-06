

(function () {
    'use strict';
    angular.module('CaseStudio', [
        'CaseStudio.controllers.main',
        'CaseStudio.controllers.home',
        
       
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'partials/partial-home.html',
                controller: 'homeController'
            })
            
    });

    

})();
