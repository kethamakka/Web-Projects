
var app = angular.module("wham", ['ngRoute', "pageslide-directive"]);

app.config(['$routeProvider',
function ($routeProvider) {
    $routeProvider.
        when('/home', {
            templateUrl: 'partials/Home.html',
            controller: 'HomeCtrl',
        }).
        when('/login', {
            templateUrl: 'partials/Login.html',
            controller: 'LoginCtrl',
        }).
        when('/profile', {
            templateUrl: 'partials/Profile.html',
            controller: 'ProfileCtrl',
        }).
    otherwise({
        redirectTo: '/home'
    })
}
]);