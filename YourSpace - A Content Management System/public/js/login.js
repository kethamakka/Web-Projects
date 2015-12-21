var app = angular.module("loginApp", []);

app.controller("logCtrl", function ($scope, $http, $rootScope) {
    console.log("hello")
    $("#getIn").click(function () {
        var un = $scope.unTxt;
        var pwd = $scope.pwTxt;
        var user = { username: un, password: pwd };
        var errorMsg = "Log In credentials are incorrect. Please try again."
        $http.post('/login', user)
        .success(function (response) {
            console.log(response.username);
            localStorage.setItem("dashboard", response.username);
            //localStorage.setItem("firstname", response.lastname);
            //localStorage.setItem("lastname", response.firstname);
            location.href = "yourSpace.html";
        })
        .error(function (response) {
            $scope.error = errorMsg;
        })
    });
});