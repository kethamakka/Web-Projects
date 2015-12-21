'use strict';

describe('Controller: LoginCtrl', function () {

    // load the controller's module
    beforeEach(module('wham'));

    var LoginCtrl;
    var scope;
    var LoginService;
    var MyService;
    var Location;
    
    var userData = [{
        first: "Prashan1",
        last: "M1",
        email: "m1@gmail.com",
        password: "iiiiiiiiii",
        confirmPassword: "iiiiiiiiii",
        referal: "11",
        errors: {}
    }]



    beforeEach(function () {
        
        LoginService = {
            getCurrentUSerProfile: function () {
                
                return;
            },
            login: function (testUser, callback) {
                for (var user of userData) {
                    if (user.email == testUser.email && user.password==testUser.password) {
                        callback('ok');
                    }
                };
                callback('error');
            },
            register: function () {
                return;
            },
            checkIfUserExist: function (testUser,callback) {
                for (var user of userData) {                    
                    if (user.email == testUser) {
                        callback("ok");
                    }
                };
                callback(null);
            }
        };

        MyService = {

        };
    }
    
    );

    // Initialize the controller and a mock scope
    beforeEach(function(){
        inject(function ($rootScope, $location, $controller) {
            Location = $location;
        scope = $rootScope.$new();
            LoginCtrl = $controller('LoginCtrl', {
                '$scope': scope,
                'LoginService': LoginService,
                'MyService':MyService,
                '$location':$location
            });
        })
    });

    //***************************************Service call test**************************************************//

    it('should call the register in LoginService', function () {
        spyOn(LoginService, 'register').and.callThrough();
        scope.register = {
            first: "Prashan",
            last: "M",
            email: "m@gmail.com",
            password: "iiiiiiiiii",
            confirmPassword: "iiiiiiiiii",
            referal: "1",
            errors: {}
        };
        scope.registerUser();
        expect(LoginService.register).toHaveBeenCalled();
    });

    //***************************************** Registration tests ****************************************//

    //first = ""
    it('should throw error: Please enter First Name.', function () {
        spyOn(LoginService, 'register').and.callThrough();

        scope.register = {
            first: "",
            last: "M",
            email: "m@gmail.com",
            password: "iiiiiiiiii",
            confirmPassword: "iiiiiiiiii",
            referal: "1",
            errors: {}
        };
        scope.registerUser();
        expect(scope.register.errors.first).toMatch("Please enter First Name.");
    });

    //first = null
    it('should throw error: Please enter First Name.', function () {
        spyOn(LoginService, 'register').and.callThrough();

        scope.register = {
            first: null,
            last: "M",
            email: "m@gmail.com",
            password: "iiiiiiiiii",
            confirmPassword: "iiiiiiiiii",
            referal: "1",
            errors: {}
        };
        scope.registerUser();
        expect(scope.register.errors.first).toMatch("Please enter First Name.");
    });

    // first="*a" 
    it('should throw error: First Name should only be alpha-numeric', function () {
        spyOn(LoginService, 'register').and.callThrough();

        scope.register = {
            first: "#a",
            last: "M",
            email: "m@gmail.com",
            password: "iiiiiiiiii",
            confirmPassword: "iiiiiiiiii",
            referal: "1",
            errors: {}
        };
        scope.registerUser();
        expect(scope.register.errors.first).toMatch("First Name should only be alpha-numeric");
    });

    // first="111" 
    it('should throw error: First Name cannot be all numbers', function () {
        spyOn(LoginService, 'register').and.callThrough();

        scope.register = {
            first: "111",
            last: "M",
            email: "m@gmail.com",
            password: "iiiiiiiiii",
            confirmPassword: "iiiiiiiiii",
            referal: "1",
            errors: {}
        };
        scope.registerUser();
        expect(scope.register.errors.first).toMatch("First Name cannot be all numbers");
    });

    // last = ""
    it('should throw error: Please enter Last Name.', function () {
        spyOn(LoginService, 'register').and.callThrough();

        scope.register = {
            first: "Prashant",
            last: "",
            email: "m@gmail.com",
            password: "iiiiiiiiii",
            confirmPassword: "iiiiiiiiii",
            referal: "1",
            errors: {}
        };
        scope.registerUser();
        expect(scope.register.errors.last).toMatch("Please enter Last Name.");
    });

    // last = null
    it('should throw error: Please enter Last Name.', function () {
        spyOn(LoginService, 'register').and.callThrough();

        scope.register = {
            first: "Prashant",
            last: null,
            email: "m@gmail.com",
            password: "iiiiiiiiii",
            confirmPassword: "iiiiiiiiii",
            referal: "1",
            errors: {}
        };
        scope.registerUser();
        expect(scope.register.errors.last).toMatch("Please enter Last Name.");
    });

    // last="*a" 
    it('should throw error: Last Name should only be alpha-numeric', function () {
        spyOn(LoginService, 'register').and.callThrough();

        scope.register = {
            first: "adam",
            last: "*a",
            email: "m@gmail.com",
            password: "iiiiiiiiii",
            confirmPassword: "iiiiiiiiii",
            referal: "1",
            errors: {}
        };
        scope.registerUser();
        expect(scope.register.errors.last).toMatch("Last Name should only be alpha-numeric");
    });

    // last="111" 
    it('should throw error: Last Name cannot be all numbers', function () {
        spyOn(LoginService, 'register').and.callThrough();

        scope.register = {
            first: "adam",
            last: "111",
            email: "m@gmail.com",
            password: "iiiiiiiiii",
            confirmPassword: "iiiiiiiiii",
            referal: "1",
            errors: {}
        };
        scope.registerUser();
        expect(scope.register.errors.last).toMatch("Last Name cannot be all numbers");
    });

    // email=""
    it('should throw error: Please enter Email.', function () {
        spyOn(LoginService, 'register').and.callThrough();

        scope.register = {
            first: "Prashant",
            last: "M",
            email: "",
            password: "iiiiiiiiii",
            confirmPassword: "iiiiiiiiii",
            referal: "1",
            errors: {}
        };
        scope.registerUser();
        expect(scope.register.errors.email).toMatch("Please enter Email.");
    });

    // email=null
    it('should throw error: Please enter Email.', function () {
        spyOn(LoginService, 'register').and.callThrough();

        scope.register = {
            first: "Prashant",
            last: "M",
            email: null,
            password: "iiiiiiiiii",
            confirmPassword: "iiiiiiiiii",
            referal: "1",
            errors: {}
        };
        scope.registerUser();
        expect(scope.register.errors.email).toMatch("Please enter Email.");
    });

    it('should throw error: Please enter valid Email.', function () {
        spyOn(LoginService, 'register').and.callThrough();

        scope.register = {
            first: "Prashant",
            last: "M",
            email: "123abc",
            password: "iiiiiiiiii",
            confirmPassword: "iiiiiiiiii",
            referal: "1",
            errors: {}
        };
        scope.registerUser();
        expect(scope.register.errors.email).toMatch("Please enter valid Email.");
    });

    it('should throw error: Email already registered with us', function () {
        spyOn(LoginService, 'register').and.callThrough();

        scope.register = {
            first: "Prashan1",
            last: "M1",
            email: "m1@gmail.com",
            password: "iiiiiiiiii",
            confirmPassword: "iiiiiiiiii",
            referal: "11",
            errors: {}
        };
        scope.registerUser();
        expect(scope.register.errors.email).toMatch("Email already registered with us");
    });

    //password=""
    it('should throw error: Please choose a Password.', function () {
        spyOn(LoginService, 'register').and.callThrough();

        scope.register = {
            first: "Prashan2",
            last: "M2",
            email: "m2@gmail.com",
            password: "",
            confirmPassword: "",
            referal: "11",
            errors: {}
        };
        scope.registerUser();
        expect(scope.register.errors.password).toMatch("Please choose a Password.");
    });

    //password=null
    it('should throw error: Please choose a Password.', function () {
        spyOn(LoginService, 'register').and.callThrough();

        scope.register = {
            first: "Prashan2",
            last: "M2",
            email: "m2@gmail.com",
            password: null,
            confirmPassword: "",
            referal: "11",
            errors: {}
        };
        scope.registerUser();
        expect(scope.register.errors.password).toMatch("Please choose a Password.");
    });

    //password=1
    it('should throw error: Password must be a atlease 8 characters and atmost 15 characters', function () {
        spyOn(LoginService, 'register').and.callThrough();

        scope.register = {
            first: "Prashan2",
            last: "M2",
            email: "m2@gmail.com",
            password: "1",
            confirmPassword: "1",
            referal: "11",
            errors: {}
        };
        scope.registerUser();
        expect(scope.register.errors.password).toMatch("Password must be a atlease 8 characters and atmost 15 characters");
    });


    //password=11111111111111111111111111
    it('should throw error: Password must be a atlease 8 characters and atmost 15 characters', function () {
        spyOn(LoginService, 'register').and.callThrough();

        scope.register = {
            first: "Prashan2",
            last: "M2",
            email: "m2@gmail.com",
            password: "11111111111111111111111111",
            confirmPassword: "11111111111111111111111111",
            referal: "11",
            errors: {}
        };
        scope.registerUser();
        expect(scope.register.errors.password).toMatch("Password must be a atlease 8 characters and atmost 15 characters");
    });


    //confirmPassword=""
    it('should throw error: Please confirm Password.', function () {
        spyOn(LoginService, 'register').and.callThrough();

        scope.register = {
            first: "Prashan2",
            last: "M2",
            email: "m2@gmail.com",
            password: "iiiiiiiiii",
            confirmPassword: "",
            referal: "11",
            errors: {}
        };
        scope.registerUser();
        expect(scope.register.errors.confirmPassword).toMatch("Please confirm Password.");
    });

    //confirmPassword=null
    it('should throw error: Please confirm Password.', function () {
        spyOn(LoginService, 'register').and.callThrough();

        scope.register = {
            first: "Prashan2",
            last: "M2",
            email: "m2@gmail.com",
            password: "iiiiiiiiii",
            confirmPassword: null,
            referal: "11",
            errors: {}
        };
        scope.registerUser();
        expect(scope.register.errors.confirmPassword).toMatch("Please confirm Password.");
    });

    it('should throw error: Passwords does not match.', function () {
        spyOn(LoginService, 'register').and.callThrough();

        scope.register = {
            first: "Prashan2",
            last: "M2",
            email: "m2@gmail.com",
            password: "iiiiiiiiii",
            confirmPassword: "iiiiiiiii",
            referal: "11",
            errors: {}
        };
        scope.registerUser();
        expect(scope.register.errors.confirmPassword).toMatch("Passwords does not match.");
    });

    //***************************************** login credentials tests ****************************************//

    // email=""
    it('should throw error: Please enter Email', function () {
        spyOn(LoginService, 'login').and.callThrough();

        scope.login = {
            email: "",
            password: "iiiiiiiiii",
            errors: {}
        };
        scope.loginUser();
        expect(scope.login.errors.email).toMatch("Please enter Email");
    });

    // email=null
    it('should throw error: Please enter Email', function () {
        spyOn(LoginService, 'login').and.callThrough();

        scope.login = {
            email: null,
            password: "iiiiiiiiii",
            errors: {}
        };
        scope.loginUser();
        expect(scope.login.errors.email).toMatch("Please enter Email");
    });

    // email=null
    it('should throw error: Please enter valid Email', function () {
        spyOn(LoginService, 'login').and.callThrough();

        scope.login = {
            email: "abc123",
            password: "iiiiiiiiii",
            errors: {}
        };
        scope.loginUser();
        expect(scope.login.errors.email).toMatch("Please enter valid Email");
    });

    //password=""
    it('should throw error: Please enter Password', function () {
        spyOn(LoginService, 'login').and.callThrough();

        scope.login = {
            email: "m4@gmail.com",
            password: "",
            errors: {}
        };
        scope.loginUser();
        expect(scope.login.errors.password).toMatch("Please enter Password");
    });

    //password=null
    it('should throw error: Please enter Password', function () {
        spyOn(LoginService, 'login').and.callThrough();

        scope.login = {
            email: "m4@gmail.com",
            password: null,
            errors: {}
        };
        scope.loginUser();
        expect(scope.login.errors.password).toMatch("Please enter Password");
    });

    
    it('should take the authentic user to home page', function () {
        spyOn(LoginService, 'login').and.callThrough();
        spyOn(Location, "path");
        scope.login = {
            email: "m1@gmail.com",
            password: "iiiiiiiiii",
            errors: {}
        };      
        scope.loginUser();      
        expect(Location.path).toHaveBeenCalledWith("/home")       
    });

    it('should throw error: Invalid Details - Please enter correct details.', function () {
        spyOn(LoginService, 'login').and.callThrough();
        spyOn(Location, "path");
        scope.login = {
            email: "m8@gmail.com",
            password: "iiiiiiiiii",
            errors: {}
        };
        scope.loginUser();
        expect(scope.login.errors.authentication).toMatch("Invalid Details - Please enter correct details.");
    });
});



