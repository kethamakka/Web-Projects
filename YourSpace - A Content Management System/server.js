var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data
app.use(session({ secret: 'this is the secret' }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

var ConnectionString = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/temp';

mongoose.connect(ConnectionString);



var userSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    username: String,
    password: String,
    email: String,
    favorites: [{ tileType: String, story: String }],
    following: [String],
    followedby: [String]
    }, { collection: "user" });

var User = mongoose.model("User", userSchema);

/*var archu = new User({
    firstname: 'Archana',
    lastname: 'Durbhaka',
    username: 'archana',
    password: 'Archana.90',
    email: 'dvsarchana@gmail.com',
    favorites: undefined,
    following: undefined,
    followedby: undefined
});

archu.save();*/

app.post('/api/register', function (req, res) {
    var postObj = req.body;
    User.create(postObj, function (err, user) {
        res.json(user);
    });
    //User.postObj.save(function (err, user) {
    //    res.json(user);
    //});
});

app.get('/api/user/:name', function (req, res) {
    var query = { username: req.params.name };
    User.findOne(query, function (err, doc) {
        res.json(doc);
       
    });
});

app.get('/api/user', function (req, res) {
    User.find(function (err, doc) {
        res.json(doc);
        res.json(err);
    });
});

app.get('/api/favorite/:username', function (req, res) {
    var uname = req.params.username;
    //console.log(uname);
    User.findOne({ username: uname }, 'favorites' ,function (err, data) {
        //console.log(data);
        res.json(data);
    });
});

app.get('/api/checkuser/:other/:user', function (req, res) {
    var uname = req.params.user;
    var otherUser = req.params.other;
    //console.log(uname);
    //console.log(otherUser);
    User.findOne({ username: uname }, 'following', function (err, data) {
        //console.log(data);
        var followList = data.following;
        //console.log(followList);
        for (var i = 0; i < followList.length; i++) {
            if (followList[i] == otherUser) {
                //console.log("match found : "+followList[i]);
                res.json({ msg: "yes" });
            }
            else {
                //console.log("no match found");
                res.json({ msg: "no" });
            }
        }
    });
});


app.post('/api/setfav/:username/:tile/:story', function (req, res) {
    var username = req.params.username;
    var kind = req.params.tile;
    var value = req.params.story;
        User.update({ username: username },
            { $push: { favorites: { $each: [{ tileType: kind, story: value }] } } }, function (err, doc) {
                if (err) throw err;
                console.log(doc);
            });
});

app.post('/api/followsrvc/:other/:user', function (req, res) {
    var username = req.params.user;
    var otherUser = req.params.other;
    //console.log("username : " + username);
    //console.log("other fellow : " + otherUser);
    User.update({ username: username },
       { $push: { following: [otherUser] } }, function (err, doc) {
            if (err) throw err;
            console.log(doc);
       });
    User.update({ username: otherUser },
        { $push: { followedby: [username] } }, function (err, doc) {
            if (err) throw err;
            console.log(doc);
        });
});

app.get('/api/following/:user', function (req, res) {
    var username = req.params.user;
    User.findOne({ username: username }, 'following', function (err, data) {
        //console.log(data);
        res.json(data);
    });
});

app.get('/api/followedby/:user', function (req, res) {
    var username = req.params.user;
    User.findOne({ username: username }, 'followedby', function (err, data) {
        //console.log(data);
        res.json(data);
    });
});



/*app.post('/api/favorite/:username/:tile/:story', function (req, res) {
    var username = req.params.username;
    var kind = req.params.tile;
    var value = req.params.story;
    //var value = data.story;
    //var username = data.username;
    console.log(username + kind + value);
    res.json({ username: username, kind: kind, value: value });
    //var result = null;
    /*User.findOne({ username: username }, function (err, res) {
        User.update({ username: username },
            { $push: { favorites: { $each: [{ tileType: kind, story: value }] } } }, function (err, doc) {
                if (err) throw err;
                console.log(doc);
            });
    })
});*/

passport.use(new LocalStrategy(
function (username, password, done) {
    User.findOne({ username: username, password: password }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        return done(null, user);
    })
}));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

var auth = function (req, res, next) {
    if (!req.isAuthenticated())
        res.send(401);
    else
        next();
};

app.get('/api/findppl/:user', function (req, res) {
    var currUser = { username: req.params.user};
    //console.log(currUser);
    User.find({}, { username: 1, _id: 0 }, function (err, data) {
        //console.log(currUser);
        if (data == null) {
            res.json({ message: "No such user exists" })
        }
        else {
            //console.log(data);
            var otherUsers = [];
            for (var i = 0; i < data.length; i++) { 
                if (JSON.stringify(data[i]) != JSON.stringify(currUser)) {
                    //console.log("spliced : " +data[i]);
                    otherUsers.push(data[i]);
                }
            }
            //console.log(otherUsers);
            res.json(otherUsers);
        }
    });
});

app.post('/login', passport.authenticate('local'),function (req, res) {
    var user = req.user;
    //console.log(user);
    res.json(user);
});

app.post('/logout', function (req, res) {
    req.logout();
    res.send(200);
});


var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
app.listen(port, ip);