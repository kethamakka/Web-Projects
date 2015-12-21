var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');

app.use(multer()); // for parsing multipart/form-data

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());   //for parsing application/json

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use(session({
    secret: process.env.SESSION_SECRET || 'this is the secret',
    resave: false,
    saveUninitialized: false
}));

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
app.listen(port, ipaddress);

app.use(express.static(__dirname + '/public'));

var routes = require("./ServerFiles/routes");
routes(app, passport, LocalStrategy);
