var express = require('express');
var router = express.Router();
var Dsl = require('../models/dsl');

module.exports = function (passport, user) {

    router.get('/', passport.isLoggedIn, function (req, res, next) {
        Dsl.find({name: new RegExp(req.query.name, "i")}, function (err, dsls) {
            res.render('dsls/index', { dsls: dsls, name: req.query.name });
        });
    });

    router.get('/new', passport.isLoggedIn, function (req, res, next) {
        var dsl = new Dsl();
        res.render('dsls/new', { dsl : dsl });
    });

    router.post('/', passport.isLoggedIn, function (req, res, next) {
        var dsl = new Dsl({ name: req.body.name, description: req.body.description });

        dsl.save(function (err) {
            if (err || !dsl) {
                req.flash("error", "Validation error");
                console.log(err);
                return res.render('dsls/new', { dsl : dsl });
            }

            req.flash("info", "Successfully saved");
            res.redirect('/admin/dsls')
        });
    });

    router.get('/edit/:id', passport.isLoggedIn, function (req, res, next) {
        Dsl.findById(req.params.id, function(err, dsl) {
            if (err || !dsl) {
                var error = new Error('Not Found');
                error.status = 404;
                return next(error);
            }

            res.render('dsls/edit', { dsl : dsl });
        });
    });

    router.get('/:id', passport.isLoggedIn, function (req, res, next) {
        Dsl.findById(req.params.id, function(err, dsl) {
            if (err || !dsl) {
                var error = new Error('Not Found');
                error.status = 404;
                return next(error);
            }

            res.render('dsls/change', { dsl : dsl });
        });
    });

    router.put('/:id', passport.isLoggedIn, function (req, res, next) {
        Dsl.findById(req.params.id, function(err, dsl) {
            if (err || !dsl) {
                var error = new Error('Not Found');
                error.status = 404;
                return next(error);
            }

            dsl.name =  req.body.name;
            dsl.description = req.body.description;

            dsl.save(function(err) {
                if (err || !dsl) {
                    req.flash("error", "Validation error");
                    console.log(err);
                    return res.render('dsls/edit', { dsl : dsl });
                }

                req.flash("info", "Successfully updated");
                res.redirect('/admin/dsls');
            });
        });
    });

    router.delete('/:id', passport.isLoggedIn, function (req, res, next) {
        Dsl.findByIdAndRemove(req.params.id, function(err, dsl) {
            req.flash("info", "Successfully deleted");
            res.redirect('/admin/dsls')
        });
    });

    return router;
};

