var express = require('express');
var User = require('../models/user');
var router = express.Router();


module.exports = function(passport) {

    router.get('/register', function(req, res, next) {
        res.render('users/register')
    });

    router.post('/register', function(req, res, next) {
        User.registerNew(req.body, function(err, user) {
            if (err) {
                req.flash("error", "Validation error");
                console.log(err);
                return res.render('users/register', { user : user });
            }

            passport.authenticate('local')(req, res, function () {
                res.redirect('/');
            });
        });
    });

    return router;
};
