var path = require('path');
var DBManager = require(path.resolve("./ServerFiles/DAO/DatabaseManager.js"))();

var C_rewardPoints = 50;

module.exports = function () {

    var checkIfUserExist = function (email, callback) {
        DBManager.findUserProfileByEmail(email, function (user) {
            if (user) {
                callback("ok");
            } else {
                callback(null);
            }
        });
    };

    var register = function (newUser, callback) {

        DBManager.findUserProfileByEmail(newUser.email, function (user) {
            if (user) {
                callback("User already exists");
            } else {

                var rand = Math.floor((Math.random() * 100) + 54);
                var referalCode = newUser.email.split('@')[0] + rand;

                var newUserProfile = {
                    'firstname': newUser.first,
                    'lastname': newUser.last,
                    'email': newUser.email,
                    'password': newUser.password,
                    'referalCode': referalCode,
                    'rewardPoints': C_rewardPoints
                };
                DBManager.createUserProfile(newUserProfile, function (resp) {
                    if (resp == 'error') { callback("error"); }
                    else { callback("ok"); }
                });

                if (newUser.referal != null) {
                    DBManager.updateRewardPoints(newUser.referal);
                }
            }
        });
    };

    var login = function (email, password, done) {
        DBManager.findUserProfileByEmailPassword(email, password, function (resp) {
            if (resp == 'error') { }
            else {
                user = resp;
                if (user != null) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Unable to login' });
                }
            }
        });
    };

    var logout = function (reqUser, callback) {
        DBManager.findUserProfileByEmail(reqUser.email, function (err, user) {
            if (user != null) {
                req.session.destroy();
                callback(200);
            }
            else {
                callback("Error");
            }
        })
    };

    var addReferalPoints = function (referalcode) {

    };

    return {
        register: register,
        login: login,
        checkIfUserExist: checkIfUserExist,
        logout: logout
    };

};