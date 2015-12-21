var app = angular.module("regApp", []);

app.controller("regController", function ($scope, $http) {
    //console.log("controller instance");

    $scope.createAccount = function () {
        var firstName = $scope.first;
        var lastName = $scope.last;
        var userName = $scope.userName;
        var password = $scope.pwd;
        var cnfPwd = $scope.cnfPwd;
        var emailId = $scope.eId;
        console.log(firstName);
        var errorMsg = "";
        if (angular.isUndefined(firstName) || firstName== null) {
            errorMsg = "ERROR: First name field can't be empty";
            console.log(errorMsg);
            $scope.errMsg = errorMsg;
            return;
        } else if (angular.isUndefined(lastName) || lastName == null) {
            errorMsg = "ERROR: last name field can't be empty";
            console.log(errorMsg);
            $("#errMsg").empty().append(errorMsg);
            return;
        }
        else if (angular.isUndefined(userName) || userName == null) {
            errorMsg = "ERROR: username field can't be empty";
            console.log(errorMsg);
            $("#errMsg").empty().append(errorMsg);
            return;
        }
        else if (angular.isUndefined(password) || password == null) {
            errorMsg = "ERROR: password field can't be empty";
            console.log(errorMsg);
            $("#errMsg").empty().append(errorMsg);
            return;
        }
        else if (!validatePass(password)) {
            errorMsg = "ERROR: password must have atleast one Uppercase letter, one lowercase letter, one special character, one numerical digit, atleast 8 characters and 12 characters at most.";
            console.log(errorMsg);
            $("#errMsg").empty().append(errorMsg);
            return;
        }
        else if (angular.isUndefined(cnfPwd) || cnfPwd == null) {
            errorMsg = "ERROR: Please re-type the password";
            console.log(errorMsg);
            $("#errMsg").empty().append(errorMsg);
            return;
        }
        else if (cnfPwd != password) {
            errorMsg = "ERROR: Passwords must be same";
            console.log(errorMsg);
            $("#errMsg").empty().append(errorMsg);
            return;
        }
        else if (angular.isUndefined(emailId) || emailId == null) {
            errorMsg = "ERROR: email field can't be empty and input must be of the form 'someone@example.com'";
            console.log(errorMsg);
            $("#errMsg").empty().append(errorMsg);
            return;
        }
        else {
            errorMsg = "Registeration is processing";
            $("#errMsg").empty().append(errorMsg).css("color", "green");
            $http.get('/api/user/' + userName )
            .success(function(response){
                //console.log(response);
                var userObj = {
                    firstname: firstName,
                    lastname: lastName,
                    username: userName,
                    password: password,
                    email: emailId,
                    favorites: undefined,
                    following: undefined,
                    followedby: undefined
                };
                //console.log(userObj);
                userStr = JSON.stringify(userObj);
                if (response == null) {
                    $http.post('/api/register', userObj)
                    .success(function (response){
                        //console.log(response);
                        alert("Thank you. You are registered. You can now login");
                        location.href = "loginConfirm.html";
                    });
                    
                }
                else {
                    errorMsg = "This username has already been chosen. Please try again";
                    $("#errMsg").empty().append(errorMsg).css("color", "orangered");
                }
            });
        }

    };
});
       
               
function validatePass(password){
    var passwordFormat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,12}$/;
    if(password.match(passwordFormat)){
        return true;
    }
    else{
        return false;
    }
}






    