(function () {
    'use strict';

    angular.module("parkGorkogo.controllers.events", [
        'ui.router',
        'ui.bootstrap',
        'utf8-base64',
        'ngStorage',
        'ngSanitize'
    ])
    .controller('eventsCalendarController', function ($scope, $state, $stateParams, $http, base64, httpService, $localStorage, sharedProperties) {

        // подсчет высоты слайдера
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            y = w.innerHeight || e.clientHeight || g.clientHeight;
        $scope.myHeight = Math.round(y / 2.66) + "px";

        // функция клика на нативную кнопку назад
        function onBackKeyDown(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            $state.go('home');
        }
        // подписываемся на событие deviceready
        document.addEventListener('deviceready', onDeviceReady.bind(this), false);
        // как только устройство готово, подписываемся на событие клика на нативную кнопку назад
        function onDeviceReady() {
            // Handle the Cordova pause and resume events                    
            document.addEventListener("backbutton", onBackKeyDown, false);
            // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        };
               
        // инициализация списка всех событий из базы
        var eventsTable = $localStorage.EventsTable;
        $scope.datePickerShow = true;
        // инициализация  календаря
        if (!eventsTable) {
            $scope.datePickerShow = false;
        };
        
        
        $scope.isDateDisabled = function (date, mode) {
            if (eventsTable[date.format('Y.m.d')]) {
                return false;
            }
            else return true;
        };

        $scope.getDayClass = function (date, mode) {
            if (eventsTable[date.format('Y.m.d')]) {
                console.log("da");
                return 'full'
            }
        };
        // функция перехода на список событий (вызывается пользователем)
        $scope.returnEventsList = function (item) {
            console.log(item);
            $state.go('eventsList', { 'selectedDate': eventsTable[item.format('Y.m.d')]});
        };   

        // функция возврата в главное меню (вызывается пользователем)
        $scope.returnMainMenu = function () {
            $state.go('home');
        };
        
        var sercretkey = 0;
        $scope.secret = function () {
            sercretkey++;
            if (sercretkey == 7) {
                alert("♥♥♥♥♥♥♥ Уаа чел твоя мама может тобой гордиться, ты нашел мою пасхалку ♥♥♥ Впереди тебя ждет пасхальный взрыв ♥♥♥ скорее беги сюда, если тебе интересно: http://b7n.ru/?t=peggypage зы. Привет и спасибо Пеке за то, что помог мне с супер пупер картой. Всем мир и счастье, dk! ♥♥♥♥♥");
                sercretkey = 0;
            };
        };

    })
    .controller('eventsListController', function ($scope, $state, $stateParams, $http, base64, httpService, $localStorage, sharedProperties) {

        function onBackKeyDown(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            $state.go('eventsCalendar');
        };

        document.addEventListener('deviceready', onDeviceReady.bind(this), false);

        function onDeviceReady() {
            // Handle the Cordova pause and resume events                    
            document.addEventListener("backbutton", onBackKeyDown, false);
            // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        };

        var weeks = ['Вс','Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        var month = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октябля', 'Ноября', 'Декабря'];
        var date = new Date($stateParams.selectedDate.datestring);
        
        $scope.dateString = weeks[date.getDay()] + ', ' + date.getDate() + ' ' + month[date.getMonth()] + ' ' + date.getFullYear();
        console.log($scope.dateString);
        var counter = 0; // счетчик для объявления классов css      
        $scope.eventsElements = []; // массив событий
        // перебираем все элементы
        angular.forEach($stateParams.selectedDate.object, function (eventsItem) {
            if (counter == 0) {
                var date = new Date(eventsItem.datetime);
                if (date.getMinutes() == 0) {
                    var time = date.getHours() + ':00';
                }
                else {
                    var time = date.getHours() + ':' + date.getMinutes();
                }        

                var newElement = {
                    'class': 'attractionSecondMenu' + counter,
                    'object': eventsItem
                }

                newElement.object['time'] = time;
                $scope.eventsElements.push(newElement);
                counter++;
            }
            else {
                var newElement = {
                    'class': 'attractionSecondMenu' + counter,
                    'object': eventsItem
                }
                $scope.eventsElements.push(newElement);
                counter--;
            }
        });

        // функция перехода на информацию о предстоящем событии (вызывается пользователем)
        $scope.returnEventInfo = function (item) {
            console.log(item);
            httpService
                .getEventsInfo(item.object.guid_elem)
                .success(function (data, status, headers, config) {
                    $localStorage.eventsCard[item.object.guid_elem] = data;
                    $state.go('eventsInfo', {
                        'selectedEvents': data,
                        'noInternet': false,
                        'selectedDate': $stateParams.selectedDate
                    });
                })
                .error(function () {
                    if ($localStorage.eventsCard[item.object.guid_elem]) {                        
                        $state.go('eventsInfo', {
                            'selectedEvents': $localStorage.eventsCard[item.object.guid_elem],
                            'noInternet': false,
                            'selectedDate': $stateParams.selectedDate
                        });
                    }
                    else {
                        $state.go('eventsInfo', {
                            'selectedEvents': item,
                            'noInternet': true,
                            'selectedDate': $stateParams.selectedDate
                        });
                    }
                    
                });
        }

        // функция перехода на предыдущий шаг (вызывается пользователем)
        $scope.returnEventsCalendar = function () {
            $state.go('eventsCalendar');
        };
        
    })
    .controller('eventsInfoController', function ($scope, $state, $stateParams, $http, base64, httpService, $localStorage) {

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
            $state.go('eventsList', { 'selectedDate': $stateParams.selectedDate });
        }

        document.addEventListener('deviceready', onDeviceReady.bind(this), false);

        function onDeviceReady() {
            // Handle the Cordova pause and resume events                    
            document.addEventListener("backbutton", onBackKeyDown, false);
            // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        };

        if ($stateParams.noInternet == false) {
            $scope.myInterval = 3000;
            $scope.eventsInfoSlides = [];
            
            angular.forEach($stateParams.selectedEvents.img_links, function (image) {
                var object = { image: base64.decode(image) };
                $scope.eventsInfoSlides.push(object);
            });
            $scope.name = base64.decode($stateParams.selectedEvents.name);
            $scope.desc = base64.decode($stateParams.selectedEvents.desc);
            $scope.desc = $scope.desc.replace(/(\r\n|\n|\r)/gm, "<br>");
        }
        else {
            var url = 'content/images/park.png';
            $scope.eventsInfoSlides = [];
            var object = { image: url };
            $scope.eventsInfoSlides.push(object);
            $scope.name = $stateParams.selectedEvents.object.name;
        }
        $scope.returnEventsList = function () {
            
            $state.go('eventsList', { 'selectedDate': $stateParams.selectedDate });
        };
    })
})();