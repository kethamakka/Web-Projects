app.factory("MyService", function ($http) {

    //filter
    var filter;
    var getFilter = function () {
        return filter;
    }
    var setFilter = function (newFilter) {
        filter = newFilter;
    }

    //Google Maps
    var position = { lat: null, lon: null }
    var initUserPosition = function (callback) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (pos) {
                position.lat = pos.coords.latitude;
                position.lon = pos.coords.longitude;
                callback('ok');
            });
        } else {
            callback('Geolocation is not supported by this browser.');
        }
    };
    var getUserPosition = function () {
        return position;
    };

    //Return block
    return {
        initUserPosition: initUserPosition,
        getUserPosition: getUserPosition,
        getFilter: getFilter,
        setFilter: setFilter
    }
});