
app.controller("LoginCtrl", function ($scope, MyService, $location, LoginService) {

    $scope.showForgotPassword = 0;

    $scope.register = {
        first: null,
        last: null,
        email: null,
        password: null,
        confirmPassword: null,
        referal: null,
        errors: {}
    };

    $scope.login = {
        email: null,
        password: null,
        errors: {}
    };

    $scope.forgotPassword = {
        email: null,
        errors: {}
    };

    //***************************************** Go To Home Page ****************************************//

    $scope.goToHome = function () {
        $location.url('/home');
    };

    //***************************************** Register User ****************************************//

    $scope.registerUser = function () {

        $scope.validateRegisterFirst();
        $scope.validateRegisterLast();
        $scope.validateRegisterEmail();
        $scope.checkIfUserExist();
        $scope.validateRegisterPassword();
        $scope.validateRegisterConfirmPassword();

        if (Object.keys($scope.register.errors).length == 0) {

            var newUSer = $scope.register;
            if (newUSer.referal){
                newUSer.referal.trim();
            }
            LoginService.register(newUSer, function (msg) {
                if (msg == 'ok') {
                    $location.url("/home");
                }
            });
        };
    };

    //*********************************************** Login User ****************************************//

    $scope.loginUser = function () {

        delete $scope.login.errors.authentication;
        $scope.validateLoginEmail();
        $scope.validateLoginPassword();

        if (Object.keys($scope.login.errors).length == 0) {

            var user = $scope.login;

            LoginService.login(user, function (msg) {

                if (msg == 'ok') {
                    $location.url("/home");
                } else if (msg == 'error') {
                    $scope.login.errors.authentication = "Invalid Details - Please enter correct details.";
                }

            });
        }
    };

    //*****************************************  ForgotPassword ****************************************//

    $scope.toggleForgotPassword = function () {

        if ($scope.showForgotPassword) {
            $scope.login = {
                email: null,
                password: null,
                errors: {}
            }
        } else {
            $scope.forgotPassword = {
                email: null,
                errors: {}
            };
        }

        $scope.showForgotPassword = !$scope.showForgotPassword;
    };

    $scope.sendPasswordToEmail = function () {
        $scope.validateForgotPasswordEmail();
        if ($scope.forgotPassword.errors.email == undefined) {
            LoginService.checkIfUserExist($scope.forgotPassword.email, function (res) {
                if (res == null) {
                    $scope.forgotPassword.errors.email = "Email not registered with us";
                }
            });
        }
    };

    //***************************************** Register Validations ****************************************//

    $scope.validateRegisterFirst = function () {
        if ($scope.register.first == null || $scope.register.first == "") {
            $scope.register.errors.first = "Please enter First Name.";
        } else if (!isAlphaNumeric($scope.register.first)) {
            $scope.register.errors.first = "First Name should only be alpha-numeric";
        }else if (isAllNumeric($scope.register.first)) {
            $scope.register.errors.first = "First Name cannot be all numbers";
        }else {
            delete $scope.register.errors.first;
        };
    };

    $scope.validateRegisterLast = function () {
        if ($scope.register.last == null || $scope.register.last == "") {
            $scope.register.errors.last = "Please enter Last Name.";
        } else if (!isAlphaNumeric($scope.register.last)) {
            $scope.register.errors.last = "Last Name should only be alpha-numeric";
        } else if (isAllNumeric($scope.register.last)) {
            $scope.register.errors.last = "Last Name cannot be all numbers";
        } else {
            delete $scope.register.errors.last;
        };
    };

    $scope.validateRegisterEmail = function () {
        if ($scope.register.email == null || $scope.register.email == "") {
            $scope.register.errors.email = "Please enter Email.";
        }
        else if (!validateEmail($scope.register.email)) {
            $scope.register.errors.email = "Please enter valid Email.";
        } else {
            delete $scope.register.errors.email;
        };
    };

    $scope.checkIfUserExist = function () {
        $scope.validateRegisterEmail();
        if ($scope.register.errors.email == undefined) {
            LoginService.checkIfUserExist($scope.register.email, function (res) {
                if (res == 'ok') {
                    $scope.register.errors.email = "Email already registered with us";
                }
            });
        }
    };

    $scope.validateRegisterPassword = function () {
        if ($scope.register.password == null || $scope.register.password == "") {
            $scope.register.errors.password = "Please choose a Password.";
        } else if ($scope.register.password.length < 8 || $scope.register.password.length>15) {
            $scope.register.errors.password = "Password must be a atlease 8 characters and atmost 15 characters";
        } else {
            if ($scope.register.confirmPassword != null || $scope.register.confirmPassword != "") {
                $scope.validateRegisterConfirmPassword();
            }
            delete $scope.register.errors.password;
        };
    };

    $scope.validateRegisterConfirmPassword = function () {
        if ($scope.register.confirmPassword == null || $scope.register.confirmPassword == "") {
            $scope.register.errors.confirmPassword = "Please confirm Password.";
        } else if ($scope.register.confirmPassword != $scope.register.password) {
            $scope.register.errors.confirmPassword = "Passwords does not match.";
        } else {
            delete $scope.register.errors.confirmPassword;
        };
    };

    //******************************************* Login Validations ****************************************//

    $scope.validateLoginEmail = function () {
        if ($scope.login.email == null || $scope.login.email == "") {
            $scope.login.errors.email = "Please enter Email";
        }
        else if (!validateEmail($scope.login.email)) {
            $scope.login.errors.email = "Please enter valid Email";
        } else {
            delete $scope.login.errors.email;
        };
    };

    $scope.validateLoginPassword = function () {
        if ($scope.login.password == null || $scope.login.password == "") {
            $scope.login.errors.password = "Please enter Password";
        } else {
            delete $scope.login.errors.password;
        };
    };

    //******************************************* Forgot Password Validations ****************************************//

    $scope.validateForgotPasswordEmail = function () {
        if ($scope.forgotPassword.email == null || $scope.forgotPassword.email == "") {
            $scope.forgotPassword.errors.email = "Please enter Email.";
        }
        else if (!validateEmail($scope.forgotPassword.email)) {
            $scope.forgotPassword.errors.email = "Please enter valid Email.";
        } else {
            delete $scope.forgotPassword.errors.email;
        };
    };

    $scope.checkIfUserExist = function () {
        $scope.validateRegisterEmail();
        if ($scope.register.errors.email == undefined) {
            LoginService.checkIfUserExist($scope.register.email, function (res) {
                if (res == 'ok') {
                    $scope.register.errors.email = "Email already registered with us";
                }
            });
        }
    };
});

function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

function isAllNumeric(text) {
    var isnum = /^\d+$/;
    return isnum.test(text);
}

function isAlphaNumeric(text) {
    var re = /^[a-z0-9]+$/i;
    return re.test(text);
}