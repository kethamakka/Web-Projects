$(function () {
    $(".tile").draggable().resizable();
});


var app = angular.module("myTime", []);
app.controller("timeController", function ($scope, $timeout) {

    // Clock Handler
    $scope.clock = Date.now()
    var tick = function () {
        $scope.clock = Date.now() // get the current time
        $timeout(tick, 1000); // reset the timer
    }
    $timeout(tick, 1000); // Start the timer

    //Double click Controller
    $scope.changeType = function () {
        $scope.am = 1;
    };
    $scope.changeTf = function () {
        $scope.am = 0;
    }
});

