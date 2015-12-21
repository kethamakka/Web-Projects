app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});

app.directive('myMap', function () {
    return {
        restrict: 'E',
        template: '<div class="gmaps" ng-controller="MapCtrl" ng-init="init()"></div>',
        replace: true
    };
});

app.directive('sidePanel', function () {
    return {
        restrict: 'E',
        templateUrl: '/partials/SidePanel.html',
        replace: true
    };
});


app.directive('infoBox', function () {
    return {
        restrict: 'E',
        templateUrl: '/partials/InfoBox.html',
        replace: true
    };
});

