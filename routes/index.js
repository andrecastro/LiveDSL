var express = require('express');
var router = express.Router();

module.exports = function(passport) {

    router.get('/', passport.isLoggedIn, function(req, res, next) {
        res.render('index');
    });

    router.get('/login', function(req, res, next) {
        res.render('login');
    });

    router.post('/login', passport.authenticate('local',
        {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        }));

    router.post('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
    });

    return router;
};
