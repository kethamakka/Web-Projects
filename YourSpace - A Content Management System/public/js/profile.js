$(document).ready(function () {
    ready();

    function ready() {
        renderProfile();
        renderFollow();
    }

    function getUrlParam(query) {
        var searchString = location.search.substring(1);
        var urlQueries = searchString.split('&');
        var len = urlQueries.length;
        for (i = 0; i < len; i++) {
            var queryName = urlQueries[i].split('=');
            if (queryName[0] == query) {
                return queryName[1];
            }
        }
    }

    function renderProfile() {
        username = getUrlParam('username');
        //console.log(username);
        $.ajax({
            dataType: "JSON",
            type: "GET",
            url: "/api/user/" + username,
            success: renderUser,
            error: function (errorThrown) { console.log(errorThrown); }
        })
    }

    function renderUser(data) {
        var favs = $(".bookmark");
        //console.log(favs);
        var dummy = $(".blank");
        var fname = data.firstname;
        var lname = data.lastname;
        var uname = data.username;
        var eid = data.email;
        var bkmrks = data.favorites;
        $("#who").html(fname + " " + lname);
        $("#whoun").html("Username : " + uname);
        $("#mai").html("email-id : " + eid);
        favs.empty();
        for (i in bkmrks) {
            var f = bkmrks[i];
            var temp = dummy.clone();
            temp.find(".favof").html(f.tileType);
            temp.find(".favwhat").html(f.story);
            favs.append(temp);
        }
    }

    function renderFollow() {
        var username = getUrlParam('username');
        var otherUser = getUrlParam('profileUser');
        $.ajax({
            dataType: "JSON",
            type: "GET",
            url: "/api/following/" + username,
            success: function (data) {
                console.log(data);
                var fwList = data.following;
                console.log(fwList);
                var foLen = fwList.length;
                //console.log(foLen);
                for (var i = 0; i < foLen; i++) {
                    //console.log(fwList[i]);
                    $(".followingList").append('<a target="_blank" href="otherProfile.html?user=' + username + '&profileUser=' + fwList[i] + '">' + fwList[i] + '</a><br>');

                }
            },
            error: function (errorThrown) { console.log(errorThrown); }
        })

        $.ajax({
            dataType: "JSON",
            type: "GET",
            url: "/api/followedby/" + username,
            success: function (data) {
                //console.log(data);
                var fbList = data.followedby;
                var fbLen = fbList.length;
                //console.log(foLen);
                for (var i = 0; i < fbLen; i++) {
                    //console.log(fwList[i]);
                    $(".followedbyList").append('<a target="_blank" href="otherProfile.html?user=' + username + '&profileUser=' + fbList[i] + '">' + fbList[i] + '</a><br>');
                }
            },
            error: function (errorThrown) { console.log(errorThrown); }
        })
    }
});