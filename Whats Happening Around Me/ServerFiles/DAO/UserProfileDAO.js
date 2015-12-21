var C_rewardPoints = 50;

module.exports = function (mongoose) {

    var C_rewardPoints = 50;

    var p = new mongoose.Schema({
        type: String,
        keywords: String
    })

    var Pref = new mongoose.Schema({
        index: Number,
        value: mongoose.Schema.Types.Mixed
    });

    var History = new mongoose.Schema({
        eventId: String,
        title: String,
        venueId: String,
        venueName: String,
        venueAddress: String,
        data: String
    });


    var Ratings = new mongoose.Schema({
        venueId: String,
        venueName: String,
        venueAddress: String,
        rating: Boolean
    });

    var UserProfileSchema = new mongoose.Schema({
        firstname: String,
        lastname: String,
        email: String,
        password: String,
        referalCode: String,
        rewardPoints: Number,
        preferences: {},
        history: [],
        ratings: []
    }, { collection: "UserProfile" });

    UserProfileModel = mongoose.model("UserProfileModel", UserProfileSchema)

    var create = function (newUserProfile, callback) {
        newUserProfile.preferences = { "0": [], "1": [], "2": [], "3": [] }
        newUserProfile.history = [];
        newUserProfile.ratings = [];
        var newUserProfileObject = new UserProfileModel(newUserProfile);

        newUserProfileObject.save(function (err, savedUserProfileResponce) {
            if (err) {
                callback("error");
            }
            else {
                callback("ok");
            }
        });
    };

    var findById = function (id, callback) {
        UserProfileModel.findOne({ _id: id }, function (err, userFound) {
            if (err) {
                callback("error");
            }
            else {
                callback(userFound);
            }
        });
    };

    var findByEmail = function (email, callback) {
        UserProfileModel.findOne({ email: email }, function (err, userFound) {
            if (err) {
                callback("error");
            }
            else {
                callback(userFound);
            }
        });
    };

    var findByEmailPassword = function (email, password, callback) {
        UserProfileModel.findOne({ email: email, password: password }, function (err, userFound) {
            if (err) {
                callback("error");
            }
            else {
                console.log(userFound);
                callback(userFound);
            }
        });
    };

    var updateRewardPoints = function (referalCode) {
        UserProfileModel.findOne({ referalCode: referalCode }, function (err, userFound) {
            if (err) {
                //callback('error');
            }
            else {
                if (userFound) {
                    userFound.rewardPoints += C_rewardPoints;
                    userFound.save(function (err, user) {
                        if (err) {
                            //callback('error');
                        } else {
                            //callback('ok');
                        }
                    });
                }
            }
        });
    };

    var updatePreference = function (email, preference, callback) {
        console.log("pref start " + preference);
        UserProfileModel.findOne({ email: email }, function (err, userFound) {
            if (err) {
                callback('error');
            }
            else if (userFound) {

                var index = preference.of.toString();
                var type = preference.type;
                var keywords = preference.keywords;

                updated = false;
                console.log(index);
                for (var i in userFound.preferences[index]) {
                    if (userFound.preferences[index][i].type == type) {
                        //userFound.preferences[index][i].keywords += " " + keywords
                        userFound.preferences[index][i].keywords = keywords;
                        removeDuplicates(userFound.preferences[index][i].keywords);
                        updated = true;
                    }
                }
                if (!updated) {
                    userFound.preferences[index].push({ 'type': type, 'keywords': keywords });
                    updated = true;
                }
                console.log("after update");
                console.log(userFound.preferences);
                if (updated) {
                    userFound.markModified('preferences');
                }

                userFound.save(function (err, user) {
                    console.log("error");
                    console.log(err);

                    if (err) {
                        callback('error');
                    } else {
                        callback(userFound.preferences);
                    }

                });
            }
        });
    }

    var deletePreference = function (email, preference, callback) {
        UserProfileModel.findOne({ email: email }, function (err, userFound) {
            if (err) {
                callback('error');
            }
            else if (userFound) {
                console.log("delete dao");
                console.log(preference);
                var index = preference.of.toString();
                var type = preference.type;
                var keywords = preference.keywords;

                updated = false;
                console.log(index);
                for (var i in userFound.preferences[index]) {
                    if (userFound.preferences[index][i].type == type) {
                        userFound.preferences[index].splice(i, 1);
                        updated = true;
                    }
                }

                console.log("after update");
                console.log(userFound.preferences);
                if (updated) {
                    userFound.markModified('preferences');
                }

                userFound.save(function (err, user) {
                    console.log("error");
                    console.log(err);

                    if (err) {
                        callback('error');
                    } else {
                        callback(userFound.preferences);
                    }

                });
            }
        });
    }

    var removeDuplicates = function (text) {
        var a = [];
        var arr = text.split(" ");
        for (i = 0; i < arr.length; i++) {
            var current = arr[i];
            if (a.indexOf(current) < 0) a.push(current);
        }
        return a.join(" ");
    }

    var changePassword = function (email, oldPass, newPass, callback) {
        UserProfileModel.findOne({ email: email, password: oldPass }, function (err, user) {
            if (user) {
                user.password = newPass;

                user.save(function (err, user) {
                    if (err) {
                        callback('db error');
                    } else {
                        callback("ok");
                    }

                });

            } else {
                callback("errror")
            }
        })
    }

    //*********************************************** Going to Event *******************************************//

    var createHistory = function (email, data, callback) {
        UserProfileModel.findOne({ email: email }, function (err, user) {
            if (user) {

                var found = false;
                for (h in user.history) {
                    if (user.history[h].eventId == data.eventId) {
                        found = true;
                    }
                }
                if (!found) {
                    var newHistory = {
                        eventId: data.eventId,
                        title: data.title,
                        venueId: data.venueId,
                        venueName: data.venueName,
                        venueAddress: data.venueAddress,
                        date: data.date
                    }
                    user.history.unshift(newHistory);
                }
                user.save(function (err, savedUser) {
                    if (err) {
                        callback('error');
                    } else {
                        callback(savedUser.history);
                    }
                });
            } else {
                callback("error")
            }
        })
    };

    var deleteHistory = function (email, data, callback) {
        UserProfileModel.findOne({ email: email }, function (err, user) {
            if (user) {


                var index = -1;
                for (h in user.history) {
                    if (user.history[h].eventId == data.eventId) {
                        index = h;
                    }
                }

                if (index > -1) {
                    user.history.splice(index, 1);
                }

                user.save(function (err, savedUser) {
                    if (err) {
                        callback('error');
                    } else {
                        callback(savedUser.history);
                    }
                });
            } else {
                callback("error")
            }
        })
    };

    //*********************************************** Rating *******************************************//



    var createRating = function (email, data, callback) {
        UserProfileModel.findOne({ email: email }, function (err, user) {
            if (user) {

                var index = -1;
                for (r in user.ratings) {
                    if (user.ratings[r].venueId == data.venueId) {
                        index = r;
                    }
                }

                if (index > -1) {
                    // Found existing
                    if (user.ratings[index].rating == data.rating) {
                        //Delete
                        user.ratings.splice(index, 1);
                        user.markModified('ratings');

                    } else {
                        //Update
                        user.ratings[index].rating = data.rating;
                        user.markModified('ratings');
                    }
                }
                else {
                    //create
                    var newRating = {
                        venueId: data.venueId,
                        venueName: data.venueName,
                        venueAddress: data.venueAddress,
                        rating: data.rating
                    }
                    user.ratings.unshift(newRating);
                    user.markModified('ratings');

                }
                user.save(function (err, savedUser) {
                    if (err) {
                        callback('error');
                    } else {
                        callback(savedUser.ratings);
                    }
                });
            } else {
                callback("error")
            }
        })
    };

    var deleteRating = function (email, venueId, callback) {
        UserProfileModel.findOne({ email: email }, function (err, user) {
            if (user) {


                var index = -1;
                for (r in user.ratings) {
                    if (user.ratings[r].venueId == venueId) {
                        index = r;
                    }
                }

                if (index > -1) {
                    user.ratings.splice(index, 1);
                }

                user.save(function (err, savedUser) {
                    if (err) {
                        callback('error');
                    } else {
                        callback(savedUser.ratings);
                    }
                });
            } else {
                callback("error")
            }
        })
    };

    var getRatingCount = function (callback) {
        UserProfileModel.find({}, function (err, users) {
            console.log(err);
            console.log(users);
            if (err) {
                callback("error");
            }
            if (users) {
                var ratingObj = {};
                console.log(users)
                for (var i in users) {
                    var ratings = users[i].ratings;
                    for (var r in ratings) {
                        var rate = ratings[r];
                        var venueId = rate.venueId
                        var rating = rate.rating
                         
                        if (venueId == undefined) {
                            continue
                        }

                        if (ratingObj.hasOwnProperty(venueId)) {
                            //Already has key, increase count
                            if (rating == true) {
                                ratingObj[venueId].like += 1;
                            } else if (rating == false) {
                                ratingObj[venueId].dislike += 1;
                            }

                        } else {
                            //create key, initialize count
                            ratingObj[venueId] = { 'like': null, 'dislike': null };
                            if (rating == true) {
                                ratingObj[venueId].like = 1;
                            } else if (rating == false) {
                                ratingObj[venueId].dislike = 1;
                            }
                        }


                    }
                }
                callback(ratingObj);
            }
        })
    };

    return {
        create: create,
        findById: findById,
        findByEmail: findByEmail,
        findByEmailPassword: findByEmailPassword,
        updateRewardPoints: updateRewardPoints,
        updatePreference: updatePreference,
        deletePreference: deletePreference,
        changePassword: changePassword,
        createHistory: createHistory,
        deleteHistory: deleteHistory,
        createRating: createRating,
        deleteRating: deleteRating,
        getRatingCount: getRatingCount
    }
};
