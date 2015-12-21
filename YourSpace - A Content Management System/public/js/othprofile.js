$(document).ready(function () {
    ready();

    function ready() {
        renderUserProfile();
        sorhbtn();
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

    function sorhbtn() {
        var username = getUrlParam('username');
        var otherUser = getUrlParam('profileUser');
        $.ajax({
            dataType: "JSON",
            type: "GET",
            url: "/api/checkuser/" + otherUser + "/" + username,
            success: renderBtn,
            error: function (errorThrown) { console.log(errorThrown); }
        })
    }

    function renderBtn(data) {
        yesObj = {msg : "yes"};
        //noObj = {msg : "no"};
        if (JSON.stringify(data) == JSON.stringify(yesObj)) {
            //console.log("objects match");
            $("#follow").hide();
            $("#following").show();
        }
        else {
            $("#follow").show();
            $("#following").hide();
        }
    }

    function renderUserProfile() {
        var username = getUrlParam('username');
        var otherUser = getUrlParam('profileUser');
        //console.log(username);
        //console.log(otherUser);

        $.ajax({
            dataType: "JSON",
            type: "GET",
            url: "/api/user/" + otherUser,
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

    $("#follow").click(function () {
        var username = getUrlParam('username');
        var otherUser = getUrlParam('profileUser');
        $("#following").show();
        $("#follow").hide();
        $.ajax({
            dataType: "JSON",
            type: "POST",
            url: "/api/followsrvc/" + otherUser + "/" + username,
            success: function (data) {
                console.log(data);
            },
            error: function (errorThrown) { console.log(errorThrown); }
        })
    });

    function renderFollow() {
        var username = getUrlParam('username');
        var otherUser = getUrlParam('profileUser');
        $.ajax({
            dataType: "JSON",
            type: "GET",
            url: "/api/following/" + otherUser,
            success: function (data) {
                //console.log(data);
                var fwList = data.following;
                var foLen = fwList.length;
                //console.log(foLen);
                for (var i = 0; i < foLen; i++) {
                    if (fwList[i] != username) {
                        //console.log(fwList[i]);
                        $(".followingList").append('<a target="_blank" href="otherProfile.html?user=' + username + '&profileUser=' + fwList[i] + '">' + fwList[i] + '</a><br>');
                    }
                    else {
                        //console.log(fwList[i]);
                        $(".followingList").append('<a target="_blank" href="selfProfile.html?username=' + fwList[i] + '">' + fwList[i] + '</a><br>');
                    }
                }
            },
            error: function (errorThrown) { console.log(errorThrown); }
        })

        $.ajax({
            dataType: "JSON",
            type: "GET",
            url: "/api/followedby/" + otherUser,
            success: function (data) {
                //console.log(data);
                var fbList = data.followedby;
                var fbLen = fbList.length;
                //console.log(foLen);
                for (var i = 0; i < fbLen; i++) {
                    if (fbList[i] != username) {
                        //console.log(fwList[i]);
                        $(".followedbyList").append('<a target="_blank" href="otherProfile.html?user=' + username + '&profileUser=' + fbList[i] + '">' + fbList[i] + '</a><br>');
                    }
                    else {
                        //console.log(fwList[i]);
                        $(".followedbyList").append('<a target="_blank" href="selfProfile.html?username=' + fbList[i] + '">' + fbList[i] + '</a><br>');
                    }
                }
            },
            error: function (errorThrown) { console.log(errorThrown); }
        })
    }
});