var i = $(".tile").length;
//console.log(localStorage.getItem("dashboard"));
var username = localStorage.getItem("dashboard");
var firstname = localStorage.getItem("firstname");
var lastname = localStorage.getItem("lastname");

$(function () {
    $("#addTile").click(function () {
       addTile(250, 150);
    });
});







function addTile(x, y) {
    var i = $(".tile").length;
    console.log(i);
    //var tile = $('<div class="tile" id="tile' + (i+1) + '"><div class="header"><div class="title"><span>Pick a category here</span></div><div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="true"><span class="caret"></span></button><ul class="dropdown-menu" role="menu"><li><a href="#">Google</a></li><li><a href="#">Maps</a></li><li><a href="#">Dictionary</a></li><li class="divider"></li><li><a href="#">Clock</a></li></ul></div></div><div class="cont-contain"><div class="content"></div></div>');
    var tile = $(".template").clone();
    tile.removeClass("template").addClass("tile");
    tile.removeAttr("id").attr('id', 'tile' + (i + 1));
    tile.appendTo(".container")
        .draggable()
        .resizable()
        .css({
            "position": "absolute",
            "left": x,
            "top": y
        });
        

    var tileId = "#tile" + (i + 1);

    $(tileId + " .del").on('click', function () {
        $(tileId).remove();
    });

    $(tileId).on("click", "#setGoogle", function (event) {

        var targ = $(event.target);
        var content = $(targ.parents(".content")[0]);
        var deleteTile = content.parents('.tile').find('.del')[0];
        var tile = content.parents('.tile')[0];
        if ($(".google").length == 0) {           
            var googleTemplate = $(".googleTemplate").clone(true, true);
            googleTemplate.removeClass("googleTemplate").addClass("google");
            googleTemplate.show();
            content.empty().append(googleTemplate);
            //$(".tile").resizable('destroy');
            var title = content.parents('.tile').find('.title')[0];
            $(title).empty().html('Google');
            $(deleteTile).show();
                      
        }
        else {
            $(".warning").show();
            $(".warning").siblings().fadeOut();
        }

        var gText = $(tile).find("#g-it")[0];
        var gSrch = $(tile).find("#g-srch")[0];
        $(gSrch).click(function () {
            var key = $(gText).val();
            var link = "https://www.google.com/?gws_rd=ssl#q=KEY";
            if (key.length != 0) {
                link = link.replace("KEY", key);
                window.open(link);
            }
            else {
                $(gText).focus();
            }
        });
       
    });

    $(tileId).on("click", "#setWeather", function (event) {
        var targ = $(event.target);
        var content = $(targ.parents(".content")[0]);
        var deleteTile = content.parents('.tile').find('.del')[0];
        var title = content.parents('.tile').find('.title')[0];
        var tile = content.parents('.tile')[0];
        var weatherTemplate = $(".weatherTemplate").clone();
        weatherTemplate.removeClass("weatherTemplate").addClass("weather");
        weatherTemplate.show();
        content.empty().append(weatherTemplate);
        var title = content.parents('.tile').find('.title')[0];
        $(title).empty().html('Weather');
        $(deleteTile).show();

        var plHold = $(tile).find("#w-at")[0];
        //console.log(plHold);
        var wSrch = $(tile).find("#wSrch")[0];
        //console.log(wSrch);
        $(wSrch).click(function () {
            var place = $(plHold).val();
            $.ajax({
                url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22"+ place +"%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",
                dataType: "json",
                success: function (wObj) {
                    //console.log(wObj);
                    var result = wObj.query.results.channel.item.description;
                    //console.log(result);
                    var weather = $(tile).find("#weather")[0];
                    //console.log(weather);
                    $(weather).show().empty().append(result);
                }
            });
        });
        var wFave = $(tile).find("#wFav")[0];
        $(wFave).click(function () {
            if (username == null) {
                alert("Sorry! You must be logged in for this feature");
                location.href = "login.html";
            }
            else {
                var type = $(content).children("div").attr("class");
                var query = $(plHold).val();
                var favObj = { username: username, tileType: type, story: query };
                $.ajax({
                    type: "POST",
                    url: "/api/setfav/" + username + "/" + type + "/" + query,
                    //data: favObj,
                    success: function (data) {
                        console.log(data);
                    },
                    dataType: "json"
                });
            }
        });
    });
        

    $(tileId).on("click", "#setDict", function (event) {
        var targ = $(event.target);
        var content = $(targ.parents(".content")[0]);
        var deleteTile = content.parents('.tile').find('.del')[0];

        if ($(".dictionary").length == 0) {
            var dictTemplate = $(".dictTemplate").clone();
            dictTemplate.removeClass("dictTemplate").addClass("dictionary");
            dictTemplate.show();
            content.empty().append(dictTemplate);
            var title = content.parents('.tile').find('.title')[0];
            $(title).empty().html('What does it  m. e. a. n?');
            $(deleteTile).show();
            
        }
        else {
            $(".warning").show();
            $(".warning").siblings().fadeOut();
        }

        var field = $(tile).find("#dTxt")[0];
        var srch = $(tile).find("#dSrch")[0];
        var ul = $(tile).find(".drendedr")[0];
        
        $(srch).click(function () {
            var word = $(field).val();
            $(ul).empty();
            $.ajax({
                url: "http://api.wordnik.com:80/v4/word.json/" + word + "/definitions?limit=10&includeRelated=true&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5",
                dataType: "json",
                success: function (result) {
                    if (result.length != 0) {
                        for (var i in result) {
                            var data = result[i];
                            var meaning = data.text;
                            var pos = data.partOfSpeech;
                            var li = $("<li class='list-group-item-success'><span class='badge' style='margin:3px'>" + pos + "</span>" + meaning + "</li>");
                            var result = $(ul).append(li);
                            $(content).append(result);
                        }
                    }
                    else {
                        var li = $("<li class='list-group-item-danger'><span class='badge' style='margin:3px'>Note</span>There are no favorites yet for you.</li>");
                        $(content).append($(ul).append(li));
                    }
                }
            })
        });

        var dictFav = $(tile).find("#dictFav")[0];
        $(dictFav).click(function () {
            if (username == null) {
                alert("Sorry! You must be logged in for this feature");
                location.href = "login.html";
            }
            else {
                var type = $(content).children("div").attr("class");
                var query = $(field).val();

                var favObj = { username: username, tileType: type, story: query };
                $.ajax({
                    type: "POST",
                    url: "/api/setfav/" + username + "/" + type + "/" + query,
                    //data: favObj,
                    success: function (data) {
                        console.log(data);
                    },
                    dataType: "json"
                });
            }
        });

    });

    $(tileId).on("click", "#setMaps", function (event) {
        var targ = $(event.target);
        var content = $(targ.parents(".content")[0]);
        var deleteTile = content.parents('.tile').find('.del')[0];
        var title = content.parents('.tile').find('.title')[0];
        var tile = content.parents('.tile')[0];
        console.log(tile);
        if ($(".maps").length == 0) {
            var mapsTemplate = $(".mapsTemplate").clone();
            mapsTemplate.removeClass("mapsTemplate").addClass("maps");
            mapsTemplate.show();
            content.empty().append(mapsTemplate);
            $(title).empty().html('Geolocator');
            $(deleteTile).show();
        }
        else {
            $(".warning").show();
            $(".warning").siblings().fadeOut();
        }

        var loTxt = $(tile).find("#loTxt")[0];
        //console.log(loTxt);
        var loSrch = $(tile).find("#loSrch")[0];
        $(loSrch).click(function () {
            pin = $(loTxt).val();
            URL = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDA7mzRWIGOnQbvyU71Kc-oT2Li3CRan20&q=' + pin;
            //console.log(URL);
            var mapDiv = $(tile).find("#map")[0];
            var map = '<iframe width="400" height="300" frameborder="0" style="border:0" src="' + URL + '"></iframe>';
            $(mapDiv).empty().append(map);
        });

        var loFav = $(tile).find("#loFav")[0];
        $(loFav).click(function () {
            if (username == null) {
                alert("Sorry! You must be logged in for this feature");
                location.href = "login.html";
            }
            else {
                var type = $(content).children("div").attr("class");
                var query = $(loTxt).val();
                var favObj = { username: username, tileType: type, story: query };
                $.ajax({
                    type: "POST",
                    url: "/api/setfav/" + username + "/" + type + "/" + query,
                    //data: favObj,
                    success: function (data) {
                        console.log(data);
                    },
                    dataType: "json"
                });
            }
        });

    });

    $(tileId).on("click", "#setDir", function (event) {
        var targ = $(event.target);
        var content = $(targ.parents(".content")[0]);
        var deleteTile = content.parents('.tile').find('.del')[0];
        var title = content.parents('.tile').find('.title')[0];
        var tile = content.parents('.tile')[0];
        if ($(".directions").length == 0) {
            var dirTemplate = $(".dirTemplate").clone();
            dirTemplate.removeClass("dirTemplate").addClass("directions");
            dirTemplate.show();
            content.empty().append(dirTemplate);
            $(title).empty().html('Director');
            $(deleteTile).show();
         }
        else {
            $(".warning").show();
            $(".warning").siblings().fadeOut();
        }

        var src = $(tile).find("#dirSrc")[0];
        var dest = $(tile).find("#dirDest")[0];
        var srch = $(tile).find("#dirSrch")[0];
        var dirMap = $(tile).find("#dirMap")[0];
        $(srch).click(function () {
            var sPin = $(src).val();
            var dPin = $(dest).val();
            var URL = 'https://www.google.com/maps/embed/v1/directions?key=AIzaSyDA7mzRWIGOnQbvyU71Kc-oT2Li3CRan20&origin=' + sPin + '&destination=' + dPin + '&avoid=tolls|highways';
            if (sPin.length != 0 && dPin.length != 0) {
                var map = '<iframe width="400" height="300" frameborder="0" style="border:0" src="' + URL + '"></iframe>';
                $(dirMap).empty().append(map);
            }
            else {
                $(srch).focus();
            }
        });
    });

    $(tileId).on("click", "#setYT", function (event) {
        var targ = $(event.target);
        var content = $(targ.parents(".content")[0]);
        var deleteTile = content.parents('.tile').find('.del')[0];
        var tile = content.parents('.tile')[0];
        var title = content.parents('.tile').find('.title')[0];
        var ytTemplate = $(".ytTemplate").clone();
        ytTemplate.removeClass("ytTemplate").addClass("youtube");
        ytTemplate.show();
        content.empty().append(ytTemplate);
        $(title).empty().html('Youtube');
        $(tile).css({"width" : "auto"});
        $(deleteTile).show();

        var yText = $(tile).find("#yTxt")[0];
        var ySrch = $(tile).find("#ySrch")[0];
        $(ySrch).click(function(){
            var key =$(yText).val();
            var link = "http://www.youtube.com/embed?listType=search&list="+key;
            if (key.length != 0) {
                link = link.replace("QUERY", key);
                var player = '<iframe id="ytplayer" type="text/html" width="430" height="270"src=" ' + link + ' "+ ""frameborder="0"/>'
                //console.log(player);
                var playCont = $(tile).find("#video")[0];
                $(playCont).empty().append(player);
            }
            else {
                $(ySrch).focus();
            }
        });

        var youFav = $(tile).find("#youFav")[0];
        $(youFav).click(function () {
            if (username == null) {
                alert("Sorry! You must be logged in for this feature");
                location.href = "login.html";
            }
            else {
                var type = $(content).children("div").attr("class");
                var query = $(yText).val();
                var favObj = { username: username, tileType: type, story: query };
                $.ajax({
                    type: "POST",
                    url: "/api/setfav/" + username + "/" + type + "/" + query,
                    //data: favObj,
                    success: function (data) {
                        console.log(data);
                    },
                    dataType: "json"
                });
            }
            /*$.ajax({
                type: "POST",
                url: "/api/favorite/" + username + "/" + type + "/" + query,
                //data: favObj,
                success: function (data) {
                    console.log(data);
                },
                dataType: "json"
            });*/
        });
    });

    $(".warning").on('click', function () {
        $(".warning").hide();
        $(".tile").show();
        $(".clock").show();
    });
}