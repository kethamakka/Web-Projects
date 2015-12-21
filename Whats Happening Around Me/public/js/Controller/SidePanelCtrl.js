
app.controller("SidePanelCtrl", function ($rootScope, $scope, MyService,LoginService) {
    $scope.showSidePanel = false;
    $scope.currDate = new Date();

    $scope.userProfile = null;

    $scope.types = ["music", "conference", "comedy",
                        "learning education", "family fun kids", "festivals parades", "movies film", "food",
                        "fundraisers", "art ", "support", "holiday", "books", "attractions", "community",
                        "business", "singles social", "schools alumni", "clubs associations",
                        "outdoors recreation", "performing arts", "animals", "politics activism", "sales", "science",
                        "religion spirituality", "sports", "technology", "other", ""];

    $scope.search = {
        type: null,
        keywords: null,
        fromDate: null,
        toDate: null,
        within: 5,
        goingWith:null,
        errors: {}
    };

    $scope.init = function () {
        MyService.setFilter($scope.search);
    };

    $scope.$watch(function () {
        return LoginService.getCurrentUSerProfile();
    }, function (response) {
        $scope.userProfile = response;
    }, true);

    $scope.toggleSidePanel = function () {
        $scope.showSidePanel = !$scope.showSidePanel;
        $rootScope.showSidePanel = $scope.showSidePanel;
    };

    $scope.validate = function () {
        if (!($scope.search.type == '' || $scope.search.type == null) &&
            isNumeric($scope.search.type)) {
            $scope.search.errors.type = "Invalid Type Name"
        } else {
            delete $scope.search.errors.type;
        };

        if ($scope.search.toDate != '' && $scope.search.toDate != null &&
            $scope.search.fromDate != '' && $scope.search.fromDate != null) {
            if ($scope.search.toDate < $scope.search.fromDate) {
                $scope.search.errors.toDate = "can not be before from date";
            }
        } else {
            delete $scope.search.errors.toDate;
        }
    };

    $scope.resetFields = function () {
        if ($scope.search.goingWith != null && $scope.search.goingWith != '') {
        $scope.search.type = null;
        $scope.search.keywords = null;
    }
}
});

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};