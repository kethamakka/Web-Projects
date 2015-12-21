
app.controller("ProfileCtrl", function ($scope, LoginService, $location, $http) {

    $scope.types = ["music", "conference", "comedy",
                        "learning education", "family fun kids", "festivals parades", "movies film", "food",
                        "fundraisers", "art ", "support", "holiday", "books", "attractions", "community",
                        "business", "singles social", "schools alumni", "clubs associations",
                        "outdoors recreation", "performing arts", "animals", "politics activism", "sales", "science",
                        "religion spirituality", "sports", "technology", "other"];

    $scope.history = [];
    $scope.ratings = [];

    $scope.activeTabIndex = 0;
    $scope.activeSubTabIndex = 0;

    $scope.userProfile = null;

    $scope.editPassword = {
        oldPassword: null,
        newPassword: null,
        confirmPassword: null,
        errors: {}
    };

    $scope.newPreference = {
        of: $scope.activeSubTabIndex,
        type: null,
        keywords: null,
        errors: {}
    }

    $scope.init = function () {
        $scope.profileOptionsToggle = false;
    }

    $scope.$watch(function () {
        return LoginService.getCurrentUSerProfile();
    }, function (response) {
        $scope.userProfile = response;
    }, true);

    $scope.$watch(function () {
        return LoginService.getCurrentUSerProfile().history;
    }, function (response) {
        $scope.history = response;
    }, true);

    $scope.$watch(function () {
        return LoginService.getCurrentUSerProfile().ratings;
    }, function (response) {
        $scope.ratings = response;
        addRatingToHistory();
    }, true);

    $scope.goToHome = function () {
        $location.url('/home');
    };

    $scope.setProfileOptionsToggle = function () {
        $scope.profileOptionsToggle = !$scope.profileOptionsToggle;
    };

    $scope.logout = function () {
        LoginService.logout();
    };

    $scope.goToProfile = function () {
        $location.url("/profile");
    };

    $scope.openTab = function (index) {
        $scope.activeSubTabIndex = 0;
        $scope.activeTabIndex = index;

        //Clean input fields
        $scope.editPassword = {
            oldPassword: null,
            newPassword: null,
            confirmPassword: null,
            errors: {}
        };

        $scope.newPreference = {
            of: $scope.activeSubTabIndex,
            type: null,
            keywords: null,
            errors: {}
        }

    }


    //*************************************changePassword*************************************

    $scope.changePassword = function () {
        $scope.validateOldPassword();
        $scope.validateNewPassword();
        $scope.validateNewConfirmPassword();

        if (Object.keys($scope.editPassword.errors).length == 0) {

            LoginService.changePassword($scope.editPassword, function (msg) {
                $scope.editPassword = {
                    oldPassword: null,
                    newPassword: null,
                    confirmPassword: null,
                    errors: {}
                };

                if (msg == 'ok') {
                    alert("Password changed successfully");
                } else {
                    alert("Incorrect old-password");
                }
            });

        };
    };
    $scope.validateOldPassword = function () {
        if ($scope.editPassword.oldPassword == null || $scope.editPassword.oldPassword == "") {
            $scope.editPassword.errors.oldPassword = "Please enter your old Password.";
        } else {
            delete $scope.editPassword.errors.oldPassword;
        }
    }
    $scope.validateNewPassword = function () {
        if ($scope.editPassword.newPassword == null || $scope.editPassword.newPassword == "") {
            $scope.editPassword.errors.newPassword = "Please choose a Password.";
        } else if ($scope.editPassword.newPassword.length < 8 || $scope.editPassword.newPassword.length > 15) {
            $scope.editPassword.errors.newPassword = "Password must be a atlease 8 characters and atmost 15 characters";
        } else {
            if ($scope.editPassword.confirmPassword != null || $scope.editPassword.confirmPassword != "") {
                $scope.validateNewConfirmPassword();
            }
            delete $scope.editPassword.errors.newPassword;
        };
    };

    $scope.validateNewConfirmPassword = function () {
        if ($scope.editPassword.confirmPassword == null || $scope.editPassword.confirmPassword == "") {
            $scope.editPassword.errors.confirmPassword = "Please confirm Password.";
        } else if ($scope.editPassword.confirmPassword != $scope.editPassword.newPassword) {
            $scope.editPassword.errors.confirmPassword = "Passwords does not match.";
        } else {
            delete $scope.editPassword.errors.confirmPassword;
        };
    };

    $scope.openSubTab = function (index) {
        $scope.activeSubTabIndex = index;
        if ($scope.activeTabIndex == 2) {
            $scope.newPreference.of = index;
        }

    };

    // ****************************************Preferences *************************************************//

    $scope.addPreference = function () {
        if ($scope.newPreference.type == null && $scope.newPreference.keywords == null) {
            $scope.newPreference.errors.type = "Please choose a category or keyword";
        } else {
            delete $scope.newPreference.errors.type;
            LoginService.updatePreference($scope.newPreference);
            $scope.newPreference = {
                of: $scope.activeSubTabIndex,
                type: null,
                keywords: null,
                errors: {}
            }

        }
    };

    $scope.updatePreference = function (index) {
        var pref = $scope.userProfile.preferences[$scope.activeSubTabIndex][index];
        $scope.newPreference = {
            of: $scope.activeSubTabIndex,
            type: pref.type,
            keywords: pref.keywords,
            errors: {}
        }
    };


    $scope.removePreference = function (index) {
        var conf = confirm("Do you really want to delete your preference?");
        if (conf) {
            var pref = $scope.userProfile.preferences[$scope.activeSubTabIndex][index];
            var deletePref = {
                of: $scope.activeSubTabIndex,
                type: pref.type,
                keywords: pref.keywords,
                errors: {}
            }
            console.log(deletePref);
            LoginService.deletePreference(deletePref);
            $scope.newPreference = {
                of: $scope.activeSubTabIndex,
                type: null,
                keywords: null,
                errors: {}
            }
        }
    };

    $scope.clearNewPreferenceField = function () {
        $scope.newPreference = {
            of: $scope.activeSubTabIndex,
            type: null,
            keywords: null,
            errors: {}
        }
    };

    //*********************************************** Going to Event *******************************************//


    $scope.deleteHistory = function (index) {
        var event = $scope.history[index];
        LoginService.deleteHistory(event, function (res) {
            if (res == 'ok') {
                //$scope.history.splice(index, 1);
                //alert("Successfully deleted from History");
                //console.log($scope.history)
            };
        });
    };


    function addRatingToHistory() {
        var events = $scope.history;
        var venues = $scope.ratings;
        var ratingDict = {};

        for (v in venues) {
            var venueId = venues[v].venueId;
            var rating = venues[v].rating;
            ratingDict[venueId] = rating;
        }

        for (var e in events) {
            var event = events[e];

            if (ratingDict[event.venueId] == true || ratingDict[event.venueId] == false) {
                event.rating = ratingDict[event.venueId];
            } else {
                event.rating = "";
            }
        }

    };

    //*********************************************** Rating *******************************************//

    $scope.rateVenueOfHistory = function (index, rate) {
        var event = $scope.history[index];

        var venueData = {
            venueId: event.venueId,
            venueName: event.venueName,
            venueAddress: event.venueAddress,
            rating: rate
        }

        LoginService.rateVenue(venueData, function (resp) {
            console.log(resp);
            if (resp == 'ok') {
                //alert("Successfully rated the Venue");
            };
        });
    };

    $scope.rateVenue = function (index, rate) {
        var venueData = $scope.ratings[index];

        var newVenueData = {
            venueId: venueData.venueId,
            venueName: venueData.venueName,
            venueAddress: venueData.venueAddress,
            rating: rate
        }

        LoginService.rateVenue(newVenueData, function (resp) {
            console.log(resp);
            if (resp == 'ok') {
                //alert("Successfully rated the Venue");
            };
        });
    };


});