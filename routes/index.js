var express = require('express');
var User = require('../models/user');
var router = express.Router();

module.exports = function(passport) {

    router.get('/', passport.isLoggedIn, function(req, res, next) {
        res.redirect('/projects');
    });

    router.get('/login', function(req, res, next) {
        res.render('login');
    });

    router.post('/login',function(req, res, next) {

        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err); }
            if (!user) { return res.redirect('/login'); }

            req.login(user, function(err) {
                if (err) { return next(err); }

                if (req.session.lastPage) {
                    return res.redirect(req.session.lastPage);
                }

                return res.redirect('/');
            });
        })(req, res, next);

    });

    router.post('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
    });

    router.get('/register', function(req, res, next) {
        res.render('register')
    });

    router.post('/register', function(req, res, next) {
        User.registerNew(req.body, function(err, user) {
            if (err) {
                req.flash("error", "Validation error");
                console.log(err);
                return res.render('register', { user : user });
            }

            passport.authenticate('local')(req, res, function () {
                res.redirect('/');
            });
        });
    });

    return router;
};
