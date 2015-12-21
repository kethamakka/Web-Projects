$(function () {
    var username = localStorage.getItem("dashboard");
    $("#findPpl").click(function () {
        if (username == null) {
            alert("Sorry! You must be logged in for this feature");
            location.href = "login.html";
        }
        else {
            var findPpl = $(".friends").clone();
            findPpl.show()
            .appendTo(".container")
            .draggable()
            .resizable()
            .css({
                "position": "absolute",
                "left": 300,
                "top": 100
            });

            $(".friends #fdel").click(function () {
                findPpl.hide();
            });

            
            var ul = $(".friends").find(".frender")[0];
            var content = $(findPpl).find(".fcontent")[0];



            $.ajax({
                type: "GET",
                url: '/api/findppl/' + username,
                dataType: "JSON",
                success: function (data) {
                    //console.log(data);
                    if (data.length != 0) {
                        for (var i in data) {
                            var user = data[i];
                            var friend = user.username;
                            var li = $('<li class="list-group-item-success"><a target="_blank" href="otherProfile.html?username=' + username + '&profileUser=' + friend + '">' + friend + '</a></li>');
                            var result = $(ul).append(li);
                            $(content).append(result);
                        }
                    }
                    else {
                        var li = $("<li class='pro list-group-item-danger'><span class='badge' style='margin:3px'>Note</span>No entries to show.</li>");
                        $(content).append($(ul).append(li));
                    }

                }
            })

            //var test = $(ul).find(".pro");
            //console.log(test);
        }
    });
});
