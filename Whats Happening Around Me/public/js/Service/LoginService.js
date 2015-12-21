app.factory("LoginService", function ($http, $location) {

    var currentUserProfile = null;

    var checkIfUserExist = function (email, callback) {
        $http.get("/api/user/email=" + email)
                .success(function (res) {
                    if (res == "error") {
                        callback("error");
                    } else if (res == '') {
                        callback(null);
                    } else {
                        callback("ok");
                    }
                });
    };

    var register = function (newUser, callback) {
        $http.post("/api/user", newUser)
        .success(function (res) {
            if (res == 'User already exists') {
                callback("Username aready exists");
            } else if (res == 'error') {
                callback("Some Error occured in Server");
            }
            else if (res == 'ok') {
                $http.post("/login", newUser)
                    .success(function (res) {
                        currentUserProfile = res;
                        callback('ok');
                    });
            }
        });
    };

    var login = function (user, callback) {
        $http.post("/login", user)
       .success(function (res) {
           currentUserProfile = res;
           console.log(currentUserProfile);
           callback('ok');
       })
        .error(function (err) {
            callback('error');
        });
    };

    var getCurrentUSerProfile = function () {
        return currentUserProfile;
    };

    var logout = function () {
        $http.post("/logout", currentUserProfile)
      .success(function (res) {
          currentUserProfile = null;
          $location.url("/");
      })
       .error(function (err) {

       });
    };

    var updatePreference = function (preference) {
        var data = { 'email': currentUserProfile.email, 'preference': preference }
        $http.post("/api/user/preference", data)
       .success(function (res) {
           currentUserProfile.preferences = res;
           //callback(res);
       })
        .error(function (err) {
            //callback('error');
        });
    }

    var deletePreference = function (preference) {
        var data = { 'email': currentUserProfile.email, 'preference': preference }
        $http.post("/api/user/preference/delete", data)
       .success(function (res) {
           currentUserProfile.preferences = res;
           //callback(res);
       })
        .error(function (err) {
            //callback('error');
        });
    };

    var changePassword = function (passData, callback) {

        var data = {
            email: currentUserProfile.email,
            oldPassword: passData.oldPassword,
            newPassword: passData.newPassword
        };

        $http.post("/api/user/password", data)
        .success(function (res) {
            callback(res);
        })
        .error(function (err) {

        })
    };


    //*********************************************** Going to Event *******************************************//

    var createHistory = function (eventData, callback) {

        var data = {
            email: currentUserProfile.email,
            data: {
                eventId: eventData.eventId,
                title: eventData.title,
                venueId: eventData.venueId,
                venueName: eventData.venueName,
                venueAddress: eventData.venueAddress,
                date: eventData.date
            }
        }
        $http.post("/api/user/history", data)
        .success(function (res) {
            if (res == 'error') {
                callback(res);
            } else {
                currentUserProfile.history = res;
                callback('ok');
            }
        })
        .error(function (err) {
            callback(res);
        })
    };

    var deleteHistory = function (eventData, callback) {
        var data = {
            email: currentUserProfile.email,
            data: {
                eventId: eventData.eventId,
                title: eventData.title,
                venueId: eventData.venueId,
                venueName: eventData.venueName,
                venueAddress: eventData.venueAddress,
                date: eventData.date
            }
        }
        $http.post("/api/user/history/delete", data)
        .success(function (res) {
            if (res == 'error') {
                callback(res);
            } else {
                currentUserProfile.history = res.history;
                currentUserProfile.ratings = res.ratings;
                callback('ok');
            }
        })
        .error(function (err) {
            callback(res);
        })
    };

    //*********************************************** Rating *******************************************//

    var rateVenue = function (venueData, callback) {

        var data = {
            email: currentUserProfile.email,
            data: {
                venueId: venueData.venueId,
                venueName: venueData.venueName,
                venueAddress: venueData.venueAddress,
                rating: venueData.rating
            }
        };

        $http.post("/api/venue/rate", data)
        .success(function (res) {
            if (res == 'error') {
                callback(res);
            } else {
                currentUserProfile.ratings = res;
                callback("ok");
            }
        })
        .error(function (err) {
            callback(res);
        })

    };
    var getAllRatings = function (callback) {
        $http.get("/api/venue/rate/count")
       .success(function (res) {
           callback(res);
       })
       .error(function (err) {
           callback(res);
       })
    };

    return {
        getCurrentUSerProfile: getCurrentUSerProfile,
        login: login,
        logout: logout,
        register: register,
        checkIfUserExist: checkIfUserExist,
        updatePreference: updatePreference,
        deletePreference: deletePreference,
        changePassword: changePassword,
        createHistory: createHistory,
        deleteHistory: deleteHistory,
        rateVenue: rateVenue,
        getAllRatings: getAllRatings
    }
});