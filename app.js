var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('flash');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var passport = require('passport');
var ConnectRoles = require('connect-roles');
var LocalStrategy = require('passport-local').Strategy;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
    if (!res.locals.title) {
        res.locals.title = "";
    }

    next();
});
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
    res.locals.loggedUser = req.user;
    next();
});


// passport config
var User = require('./models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.isLoggedIn = function (req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // save last request if it is a get
    if (req.method == 'GET') {
        req.session.lastPage = req.originalUrl;
    }

    // if they aren't redirect them to the login page
    req.flash('error', 'You must be authenticated to access this page!');
    res.redirect('/login');
};

// connect roles config
var user = new ConnectRoles({
    failureHandler: function (req, res, action) {
        // optional function to customise code that runs when
        // user fails authorisation
        var accept = req.headers.accept || '';
        res.status(403);
        if (~accept.indexOf('html')) {
            res.render('access-denied', { action: action });
        } else {
            res.send('Access Denied - You don\'t have permission to: ' + action);
        }
    }
});

// only admin can access admin pages
user.use("access admin pages", function (req) {
    return req.user.role === 'admin';
});

app.use(user.middleware());

// mongoose config
mongoose.connect('mongodb://localhost/visual_dsl');
mongoose.set('debug', true);

// routes
var routes = require('./routes/index')(passport);
var dsls = require('./routes/dsls')(passport, user);
var solicitations = require('./routes/solicitations')(passport, user);
var projects = require('./routes/projects')(passport);

app.use('/', routes);
app.use('/admin/dsls', dsls);
app.use('/admin/solicitations', solicitations);
app.use('/projects', projects);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
