(function () {
    'use strict';

    angular.module("CaseStudio.controllers.home", [
        'ui.router',
        'ui.bootstrap',
        'utf8-base64',
        'ngStorage',        
    ])
        .controller('homeController',
            function ($scope, $state, $stateParams, $http, base64, httpService, $localStorage, sharedProperties) {
               
            })
})();