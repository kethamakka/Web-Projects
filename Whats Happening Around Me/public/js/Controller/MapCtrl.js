
app.controller("MapCtrl", function ($rootScope, $scope, MyService, $element, $compile, $http, LoginService) {
    var map, infoWindow;
    var markers = [];
    var dislikedEvents = [];
    $scope.userProfile = null;

    $scope.directionsTo;

    var spinner, directionsBox;

    var isInitialLoad = false, filterApplied = false;

    // map config
    var mapOptions = {
        center: new google.maps.LatLng(50, 2),
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scrollwheel: true,
        mapTypeControl: true,
        mapTypeControlOptions: {
            position: google.maps.ControlPosition.LEFT_BOTTOM
        }
    };

    var oArgs = {
        app_key: "k6C5qrCrdBgZMSkw",
        category: "",
        q: "",
        where: "",
        date: "",
        page_size: 80,
        within: 5
    };

    $scope.init = function () {
        isInitialLoad = true;

        MyService.initUserPosition(function (msg) {
            if (msg == 'ok') {

                var position = MyService.getUserPosition();
                $scope.position = position;

                //set oArgs location parameter
                oArgs.where = $scope.position.lat + "," + $scope.position.lon;

                //if map exists, print on map
                printOnMap(oArgs);
            }
            else {
                alert(msg);
            }
        });

        LoginService.getAllRatings(function (resp) {
            if (resp != 'error') {
                $scope.ratingData = resp;
            }
        });

        
    };

    $scope.$watch(function () {
        $scope.userProfile = LoginService.getCurrentUSerProfile();
        if ($scope.userProfile) {
            return $scope.userProfile.preferences;
        }
        return
    }, function (response) {
        if (response) {
            $scope.userProfile.preferences = response;
            printOnMap(oArgs);
        }
    }, true);

    $scope.$watch(function () {
        $scope.userProfile = LoginService.getCurrentUSerProfile();
        if ($scope.userProfile) {
            return $scope.userProfile.ratings;
        }
        return
    }, function (response) {
        if (response) {
            $scope.userProfile.ratings = response;
            buildDislikedVenues();
        }
    }, true);

    function buildDislikedVenues() {
        var venues = $scope.userProfile.ratings;
        var dislikedEventsList = [];
        for (v in venues) {
            if (venues[v].rating == false) {
                dislikedEventsList.push(venues[v].venueId);
            }
        }
        dislikedEvents = dislikedEventsList;
        console.log("disliked venue ids")
        console.log(dislikedEvents);
    };

    // place a marker
    function setMarker(map, position, title, content) {
        var marker;
        var markerOptions = {
            position: position,
            map: map,
            animation: google.maps.Animation.DROP,
            title: title,
            icon: '/img/red-dot.png'
        };

        if (title == 'You are here') {
            markerOptions.icon = '/img/blue_dot.png';
            content = "You are here";
        }

        marker = new google.maps.Marker(markerOptions);
        markers.push(marker); // add marker to array

        if (content == 'You are here') {
            if (infoWindow !== void 0) {
                infoWindow.close();
            }

            if (isInitialLoad) {
                // create new window
                var infoWindowOptions = {
                    content: content
                };
                infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                infoWindow.open(map, marker);

                setTimeout(function () {
                    infoWindow.close();
                }, 4000);
                isInitialLoad = false;
            }
        };

        google.maps.event.addListener(marker, 'click', function () {
            // close window if not undefined
            if (infoWindow !== void 0) {
                infoWindow.close();
            }
            // create new window
            var infoWindowOptions = {
                content: content
            };
            infoWindow = new google.maps.InfoWindow(infoWindowOptions);
            infoWindow.open(map, marker);
        });

        //google.maps.event.addListener(marker, 'mouseover', function () {
        //    // close window if not undefined
        //    if (infoWindow !== void 0) {
        //        infoWindow.close();
        //    }
        //    // create new window
        //    var infoWindowOptions = {
        //        content: content
        //    };
        //    infoWindow = new google.maps.InfoWindow(infoWindowOptions);
        //    infoWindow.open(map, marker);
        //});

        //google.maps.event.addListener(marker, 'mouseout', function () {
        //    // close window if not undefined
        //    if (infoWindow !== void 0) {
        //        infoWindow.close();
        //    }
        //    // create new window
        //    var infoWindowOptions = {
        //        content: content
        //    };
        //    infoWindow = new google.maps.InfoWindow(infoWindowOptions);
        //    infoWindow.close(map, marker);
        //});
    };


    $scope.$watch(function () {
        return MyService.getFilter();
    },
    function (filter) {
        $scope.filter = filter;
        printOnMap(oArgs);
    },
    true);

    function printOnMap(oArgs) {
        if (map === void 0) {
            //create map and center it to the scope.position's location
            mapOptions.center = new google.maps.LatLng($scope.position.lat, $scope.position.lon);
            map = new google.maps.Map($element[0], mapOptions);
        }


        //setting defaults
        var date = new Date();
        oArgs.date = getDateInFormat(date, date);

        oArgs.category = "";
        oArgs.q = "";


        // User looged in Apply preferences
        if ($scope.userProfile && $scope.filter.goingWith != null && $scope.filter.goingWith != '') {

            var preferences = $scope.userProfile.preferences;

            preferences = preferences[$scope.filter.goingWith];

            var categories = "", keywords = "";
            for (var i in preferences) {
                if (categories == "") {
                    categories += preferences[i]["type"];
                } else {
                    categories += "," + preferences[i]["type"];
                }
                if (preferences[i]["keywords"]) {
                    karray = preferences[i]["keywords"].split(" ");
                    for (var j in karray) {
                        if (keywords == "") {
                            keywords += "description:" + karray[j];
                        } else {
                            keywords += "%20||%20description:" + karray[j];
                        }
                    }
                }
            }

            oArgs.category = categories;
            oArgs.q = keywords;
        }

        //check for filters applied
        if (filterAppliedType() ||
            filterAppliedKeywords() ||
            filterAppliedWithin() ||
            filterAppliedFromDate() ||
            filterAppliedToDate()) {

            // If any error in filters, do not update map
            if (Object.keys($scope.filter.errors).length > 0) return;

            filterApplied = true;
            if (filterAppliedType()) oArgs.category = $scope.filter.type;
            if (filterAppliedKeywords()) {
                var k = "";
                var karray = $scope.filter.keywords.split(" ");

                for (var j in karray) {
                    if (k == "") {
                        k += "description:" + karray[j];
                    } else {
                        k += "%20||%20description:" + karray[j];
                    }
                }

                oArgs.q = k;
                console.log(oArgs.q);
            }
            if (filterAppliedWithin()) oArgs.within = $scope.filter.within;
            if (filterAppliedFromDate() && !filterAppliedToDate()) oArgs.date = getDateInFormat($scope.filter.fromDate, $scope.filter.fromDate);
            if (!filterAppliedFromDate() && filterAppliedToDate()) oArgs.date = getDateInFormat(date, $scope.filter.toDate);
            if (filterAppliedFromDate() && filterAppliedToDate()) oArgs.date = getDateInFormat($scope.filter.fromDate, $scope.filter.toDate);

        }

        $scope.loading = true;

        deleteMarkers();

        setMarker(map, new google.maps.LatLng($scope.position.lat, $scope.position.lon), 'You are here', '');

        if (oArgs.category != null && oArgs.category != "") {
            oArgs.category = oArgs.category.toLowerCase().split(' ').join('_');
        }

        console.log(oArgs.category);
        //api call

        //query
        //EVDB.API.call("/events/search", oArgs, function (data) {
        //    for (var d in data.events.event) {

        //        var event = data.events.event[d];
        //        var scope = $scope.$new();
        //        scope.event = event;

        //        var compiled = $compile("<div><info-box></info-box></div>")(scope);
        //        setMarker(map, new google.maps.LatLng(event.latitude, event.longitude), event.name, compiled[0]);
        //    }
        //    $scope.loading = false;
        //});


        var url = getApiUrl();
        console.log(url);
        $http.jsonp(url)
                 .success(function (data) {
                     console.log(data);
                     if (data.events == null) $scope.loading = false;
                     if (data.events.event instanceof Array) {
                         //Output is list
                         for (var d in data.events.event) {
                             console.log("event")
                             console.log(data.events.event[d])
                             var event = data.events.event[d];
                             if (!userDislikedVenue(event.venue_id)) {
                                 console.log("venue")
                                 console.log(event.venue_id);
                                 var scope = $scope.$new();
                                 scope.event = event;
                                 console.log("Rating data")
                                 console.log($scope.ratingData);
                                 if ($scope.ratingData && $scope.ratingData.hasOwnProperty(event.venue_id)) {
                                     scope.ratingData = $scope.ratingData[event.venue_id];
                                 } else {
                                     scope.ratingData = null;
                                 }
                                 var compiled = $compile("<div><info-box></info-box></div>")(scope);

                                 setMarker(map, new google.maps.LatLng(event.latitude, event.longitude), event.name, compiled[0]);
                             }
                         }
                     } else {
                         //Output is a single event object
                         var event = data.events.event;
                         if (!userDislikedVenue(event.venue_id)) {
                             console.log("venue")
                             console.log(event.venue_id);
                             var scope = $scope.$new();
                             scope.event = event;
                             if ($scope.ratingData && $scope.ratingData.hasOwnProperty(event.venue_id)) {
                                 scope.ratingData = $scope.ratingData[event.venue_id];
                             } else {
                                 scope.ratingData = null;
                             }
                             var compiled = $compile("<div><info-box></info-box></div>")(scope);

                             setMarker(map, new google.maps.LatLng(event.latitude, event.longitude), event.name, compiled[0]);
                         }
                     }


                     $scope.loading = false;
                 }).error(function (err) {
                     console.log("err");
                     console.log(err);
                 });

        if (spinner == undefined) {
            spinner = angular.element("<center><img src='../img/gps.gif' ng-show='loading' id='spinner'></center>");
            $element.append(spinner);
            $compile(spinner)($scope);
        }

        if (directionsBox == undefined) {
            var html = "<div class='directionBox'>\
                            <input type='text' ng-model='directionsTo' disabled/> \
                            <input type='button' value='X' ng-click='clearDirection()'/> \
                        </div>"
            directionsBox = angular.element(html);
            $compile(directionsBox)($scope);
            $element.append(directionsBox);
        }
    }

    function filterAppliedType() {
        if ($scope.filter != null) {
            if ($scope.filter.type == null || $scope.filter.type == '') return false;
            else return true;
        }
        return false;
    }

    function filterAppliedKeywords() {
        if ($scope.filter != null) {
            if ($scope.filter.keywords == null || $scope.filter.keywords == '') return false;
            else return true;
        }
        return false;
    }

    function filterAppliedFromDate() {
        if ($scope.filter != null) {
            if ($scope.filter.fromDate == null || $scope.filter.fromDate == '') return false;
            else return true;
        }
        return false;
    }
    function filterAppliedToDate() {
        if ($scope.filter != null) {
            if ($scope.filter.toDate == null || $scope.filter.toDate == '') return false;
            else return true;
        }
        return false;
    }

    function filterAppliedWithin() {
        if ($scope.filter != null) {
            if ($scope.filter.within == null || $scope.filter.within == '') return false;
            else return true;
        }
        return false;
    }

    function deleteMarkers() {
        setMapOnAll(null);
        markers = [];
    }
    function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    }

    var directionsService;
    var directionsDisplay;

    $scope.clearDirection = function () {
        if (directionsDisplay) {
            $scope.directionsTo = null;
            directionsDisplay.setMap(null);
        }
    };

    $scope.calculateAndDisplayRoute = function (toAdd, lat, lon) {

        if (directionsDisplay) {
            directionsDisplay.setMap(null);
        }

        directionsService = new google.maps.DirectionsService;

        directionsDisplay = new google.maps.DirectionsRenderer({
            'map': map,
            'preserveViewport': true,
            'suppressMarkers': true
        });

        $scope.directionsTo = toAdd;

        directionsService.route({
            origin: $scope.position.lat + "," + $scope.position.lon,
            destination: lat + "," + lon,
            travelMode: google.maps.TravelMode.DRIVING
        }, function (response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }

    function getApiUrl() {
        var url = "http://api.eventful.com/json/events/search?app_key=k6C5qrCrdBgZMSkw";

        if (oArgs.q != "") url += "&q=" + oArgs.q;

        url += "&location=" + $scope.position.lat.toFixed(6) + "," + $scope.position.lon.toFixed(6);
        //Within
        url += "&within=" + parseInt(oArgs.within);

        if (filterAppliedFromDate() || filterAppliedToDate()) url += "&date=" + oArgs.date;
        else url += "&date=" + oArgs.date;

        if (oArgs.category != "") url += "&category=" + oArgs.category;


        //Size
        url += "&page_size=" + parseInt(oArgs.page_size)
        url += "&page_number=1"
        url += "&include=categories"

        console.log(url);
        url += '&callback=JSON_CALLBACK';

        return url;

    };

    function userDislikedVenue(venueId) {
        var index = dislikedEvents.indexOf(venueId);
        if (index > -1) return true;
        else return false;
    };

});


function getDateInFormat(from, to) {
    return "" + from.getFullYear() + getMonth(from) + getDay(from) + '00-' + to.getFullYear() + getMonth(to) + getDay(to) + '00';
}

function getMonth(d) {
    var currentMonth = d.getMonth() + 1;
    if (currentMonth < 10) { currentMonth = '0' + currentMonth; }
    return currentMonth;
}

function getDay(d) {
    var currentDate = d.getDate();
    if (currentDate < 10) { currentDate = '0' + currentDate; }
    return currentDate;
}