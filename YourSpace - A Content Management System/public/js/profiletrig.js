$(function () {
    var username = localStorage.getItem("dashboard");
    $(".profilepage").click(function () {
        if (username == null) {
            alert("Sorry! You must be logged in for this feature");
            location.href = "login.html";
        }
        else { 
            location.href = 'selfProfile.html?username=' + username;
        }
    });
});



       