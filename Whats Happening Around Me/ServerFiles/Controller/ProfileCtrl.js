var path = require('path');
var DBManager = require(path.resolve("./ServerFiles/DAO/DatabaseManager.js"))();

module.exports = function () {

    var updatePreference = function (email, preference, callback) {
        DBManager.updatePreference(email, preference, function (updatedPreferences) {
            if (updatedPreferences) {
                callback(updatedPreferences);
            } else {
                callback(null);
            }
        });
    };

    var deletePreference = function (email, preference, callback) {
        DBManager.deletePreference(email, preference, function (updatedPreferences) {
            if (updatedPreferences) {
                callback(updatedPreferences);
            } else {
                callback(null);
            }
        });
    };

    var changePassword = function (passwordData, callback) {

        var email = passwordData.email;
        var oldPass = passwordData.oldPassword
        var newPass = passwordData.newPassword

        DBManager.changePassword(email, oldPass, newPass, function (msg) {
            callback(msg);
        });
    };

    //*********************************************** Going to Event *******************************************//

    var createHistory = function (email, data, callback) {
        DBManager.createHistory(email, data, callback);
    }

    var deleteHistory = function (email, data, callback) {
        DBManager.deleteHistory(email, data, callback);
    }


    //*********************************************** Rating *******************************************//

    var createRating = function (email, data, callback) {
        DBManager.createRating(email, data, callback);
    }

    var deleteRating = function (email, venueId, callback) {
        DBManager.deleteRating(email, venueId, callback);
    }

    var getRatingCount = function (callback) {
        DBManager.getRatingCount(callback);
    }

    return {
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