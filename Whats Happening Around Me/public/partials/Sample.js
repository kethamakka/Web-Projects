function getDetailsOnMap() {
    var url = 'http://api.edmunds.com/api/dealer/v2/dealers/?zipcode=02115&radius=10&sortby=distance%3AASC&fmt=json&api_key=tntbh7mzjqbuh23cwek4z95x';

    $.getJSON(url, {
        'dataType': 'json'
    },
        function (data) {
            renderDealersOnMap(data);
        })
        .error(function (data) {
            //document.getElementById("err").innerHTML = "No results for your search, please try again.";
        });
}
function renderDealersOnMap(obj) {
    document.getElementById("map").style.visibility = 'visible';
    document.getElementById("map").style.height = 'auto';
    document.getElementById("mapCanvas").style.height = '400px';

    //iteratively place the data onto the map as info-window
    var dealers = obj.dealers;
    var i = 0; //to count the no. of objects
    for (var d in dealers) {
        if (i >= 10) break;

        var dealer = dealers[d];

        if (dealer.hasOwnProperty('contactInfo')) {
            var website = dealer.contactInfo.website;
            var phone = dealer.contactInfo.phone;
        } else {
            var website = "";
            var phone = "";
        }
        //prepare the contentString for the marker
        var info = '<div id="info-window">' +
                   '<h4>' + dealer.name + '</h4>' +
                   '<a href="' + website + '" target="_blank">' + website + '</a>' +
                   '<p>' + dealer.address.street + ', ' + dealer.address.stateCode + ', ' + dealer.address.zipcode +
                   ', ' + phone + '</p>' +
                   '</div>';

        //check for the first data, so as to set the map on correct location
        if (i == 0) {
            //set the map focussed on the zip code
            var myLatlng = new google.maps.LatLng(dealer.address.latitude, dealer.address.longitude);
            var mapOptions = {
                center: myLatlng,
                mapTypeId: google.maps.MapTypeId.MAP,
                zoom: 12
            };
            var map = new google.maps.Map(document.getElementById("mapCanvas"), mapOptions);
            //on mouse move : update the 2 DOM elements
            google.maps.event.addListener(map, "mousemove", function (event) {
                document.getElementById("lat").innerHTML = event.latLng.lat();
                document.getElementById("lng").innerHTML = event.latLng.lng();
            })
        }
        i = i + 1;

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(dealer.address.latitude, dealer.address.longitude),
            map: map
        });

        var infowindow = new google.maps.InfoWindow();
        google.maps.event.addListener(marker, 'click', (function (marker, info, infowoindow) {
            return function () {
                infowindow.setContent(info);
                infowindow.open(map, marker);
            }
        })(marker, info, infowindow));
        document.getElementById("err").innerHTML = "";
    }
}