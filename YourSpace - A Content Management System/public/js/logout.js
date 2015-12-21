$(function () {
    $("#logout").click(function () {
        $.ajax({
            type: "POST",
            url: '/logout',
            success: function (data) {
                location.href = "../index.html";
            },
        });
        delete window.localStorage["dashboard"];
    });
    console.log(localStorage.getItem("dashboard"));
});