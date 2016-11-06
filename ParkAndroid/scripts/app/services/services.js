(function () {
    'use strict';
    angular.module('parkGorkogo.services', ['ngStorage', 'utf8-base64', 'cgNotify'])
        .factory('httpService', [
        '$http',
        '$localStorage',
        function ($http, $localStorage) {

            return {
                getStartPhotos: function () {
                    return $http({
                        method: 'JSONP',
                        url: 'http://b7n.ru/19/?method=5&callback=JSON_CALLBACK&token=' + $localStorage.userGuid22
                    });
                },
                getUserGuid: function () {
                    return $http({
                        method: 'JSONP',
                        url: 'http://b7n.ru/19/?method=1&callback=JSON_CALLBACK'
                    });
                },
                getAttractionsTable: function () {
                    return $http({
                        method: 'JSONP',
                        url: 'http://b7n.ru/19/?method=3&callback=JSON_CALLBACK&guid_table=t1&token=' + $localStorage.userGuid22
                    });
                },
                getCardInfo: function (guid_elem) {
                    return $http({
                        method: 'JSONP',
                        url: 'http://b7n.ru/19/?method=4&callback=JSON_CALLBACK&guid_elem=' + guid_elem + '&token=' + $localStorage.userGuid22,
                        timeout: 2000
                    });
                },
                getFoodTable: function () {
                    return $http({
                        method: 'JSONP',
                        url: 'http://b7n.ru/19/?method=3&callback=JSON_CALLBACK&guid_table=t2&token=' + $localStorage.userGuid22
                    });
                },                
                getEventsTable: function () {
                    return $http({
                        method: 'JSONP',
                        url: 'http://b7n.ru/19/?method=3&callback=JSON_CALLBACK&guid_table=t3&token=' + $localStorage.userGuid22
                    });
                },
                getEventsInfo: function (guid_elem) {
                    return $http({
                        method: 'JSONP',
                        url: 'http://b7n.ru/19/?method=4&callback=JSON_CALLBACK&guid_elem=' + guid_elem + '&token=' + $localStorage.userGuid22,
                        timeout: 2000
                    });
                },
                getNewsTable: function () {
                    return $http({
                        method: 'JSONP',
                        url: 'http://b7n.ru/19/?method=3&callback=JSON_CALLBACK&guid_table=t4&token=' + $localStorage.userGuid22
                    });
                },
                getNewsInfo: function (guid_elem) {
                    return $http({
                        method: 'JSONP',
                        url: 'http://b7n.ru/19/?method=4&callback=JSON_CALLBACK&guid_elem=' + guid_elem + '&token=' + $localStorage.userGuid22,
                        timeout: 2000
                    });
                }
            };
        }])
    .service('sharedProperties', [
        '$localStorage',
        'httpService',
        'base64',
        function ($localStorage, httpService, base64) {           
            
        return {           
            getUserGuid: function () {
                ////////////////////////// получаем все из таблицы аттракционов /////////////////////////////////
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
                                $localStorage.internet = true;
                            });
                //////////////////////////////////////////////////////////////////////////////////////////////////
            },
            updateAttractionsTable: function () {
                ////////////////////////// получаем все из таблицы аттракционов /////////////////////////////////
                httpService
                    .getAttractionsTable()
                    .success(function (data, status, headers, config) {                        
                        angular.forEach(data, function (dataItem) {
                            dataItem.name = base64.decode(dataItem.name);
                            dataItem.price = base64.decode(dataItem.price);
                            dataItem.tags = base64.decode(dataItem.tags);
                        });                        
                        $localStorage.AttractionsTable = data;
                    });
                //////////////////////////////////////////////////////////////////////////////////////////////////
            },
            updateFoodTable: function () {
                ////////////////////////////// получаем все из таблицы по еде /////////////////////////////////////
                httpService
                    .getFoodTable()
                    .success(function (data, status, headers, config) {
                        angular.forEach(data, function (dataItem) {
                            dataItem.name = base64.decode(dataItem.name);
                            dataItem.tags = base64.decode(dataItem.tags);
                        });                        
                        $localStorage.FoodTable = data;
                    });
            },
            updateNewsTable: function () {
                ///////////////////////////////////////////////////////////////////////////////////////////////////////
                httpService
                    .getNewsTable()
                    .success(function (data, status, headers, config) {
                        var newDataArray = [];
                        for (var i = data.length; i > 0 ; i--) {
                            data[i - 1].name = base64.decode(data[i - 1].name);
                            newDataArray.push(data[i - 1]);

                        }
                        $localStorage.NewsTable = newDataArray;
                    });
            },
            updateEventsTable: function () {
                ///////////////////////////////////////////////////////////////////////////////////////////////////////
                var availableDates = {};
                httpService
                   .getEventsTable()
                   .success(function (data, status, headers, config) {
                       angular.forEach(data, function (dataItem) {
                           var newDate = new Date(dataItem.datetime);
                           var dateTimeNow = new Date();
                           if (newDate > dateTimeNow) {
                               if (!availableDates[newDate.format('Y.m.d')]) {
                                   var item = {
                                       'name': base64.decode(dataItem.name),
                                       'datetime': dataItem.datetime,
                                       'guid_elem': dataItem.guid_elem
                                   };
                                   availableDates[newDate.format('Y.m.d')] = {
                                       'datestring': dataItem.datetime,
                                       'object': [item]
                                   };
                               }
                               else {
                                   var item = {
                                       'name': base64.decode(dataItem.name),
                                       'datetime': dataItem.datetime,
                                       'guid_elem': dataItem.guid_elem
                                   };
                                   availableDates[newDate.format('Y.m.d')].object.push(item)
                               }
                           }

                       });                       
                       $localStorage.EventsTable = availableDates;
                   })
            },
            deleteEvents: function () {
                console.log($localStorage.eventCard);
                angular.forEach($localStorage.eventsCard, function (dataItem) {
                    console.log(dataItem);
                    var newDateTime = new Date(dataItem.datetime);
                    var dateTimeNow = new Date();
                    if (newDateTime < dateTimeNow) {
                        delete $localStorage.eventsCard[dataItem.guid_elem];
                    }
                });
            }

        };
        }])
        .service('pushService', [
        'notify',
        function (notify) {
            return {
                pushInit: function () {
                    function initPushwoosh() {
                        var pushNotification = window.plugins.pushNotification;

                        //set push notifications handler
                        document.addEventListener('push-notification', function (event) {
                            var title = event.notification.title;
                            var userData = event.notification.userdata;

                            if (typeof (userData) != "undefined") {
                                console.warn('user data: ' + JSON.stringify(userData));
                            }
                            notify({
                                message: title,
                                templateUrl: '',
                                position: 'right',
                                classes: '',
                                duration: 10000
                            });
                            
                        });

                        //initialize Pushwoosh with projectid: "GOOGLE_PROJECT_NUMBER", pw_appid : "PUSHWOOSH_APP_ID". This will trigger all pending push notifications on start.
                        pushNotification.onDeviceReady({ projectid: "973199378650", pw_appid: "8EDEB-F846D" });

                        //register for pushes
                        pushNotification.registerDevice(
                            function (status) {
                                var pushToken = status;
                                console.warn('push token: ' + pushToken);
                            },
                            function (status) {
                                console.warn(JSON.stringify(['failed to register ', status]));
                            }
                        );
                    }
                    document.addEventListener('deviceready', onDeviceReady.bind(this), false);
                    function onDeviceReady() {
                        initPushwoosh();
                    };
                }

            }
        }]);
})();

