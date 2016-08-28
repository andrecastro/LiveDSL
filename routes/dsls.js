var express = require('express');
var router = express.Router();
var Dsl = require('../models/dsl');
var ValidationException = require("../models/error/validation_exception");

module.exports = function (passport, user) {

    router.get('/', passport.isLoggedIn, function (req, res, next) {
        Dsl.find({name: new RegExp(req.query.name, "i")}, function (err, dsls) {
            res.render('dsls/index', {dsls: dsls, name: req.query.name});
        });
    });

    router.get('/new', passport.isLoggedIn, function (req, res, next) {
        var dsl = new Dsl();
        res.render('dsls/new', {dsl: dsl});
    });

    router.post('/', passport.isLoggedIn, function (req, res, next) {
        var dsl = new Dsl({name: req.body.name, description: req.body.description});

        dsl.save(function (err) {
            if (err || !dsl) {
                req.flash("error", "Validation error");
                console.log(err);
                return res.render('dsls/new', {dsl: dsl});
            }

            req.flash("info", "Successfully saved");
            res.redirect('/admin/dsls')
        });
    });

    router.get('/edit/:id', passport.isLoggedIn, function (req, res, next) {
        Dsl.findById(req.params.id, function (err, dsl) {
            if (err || !dsl) {
                var error = new Error('Not Found');
                error.status = 404;
                return next(error);
            }

            res.render('dsls/edit', {dsl: dsl});
        });
    });

    router.get('/:id', passport.isLoggedIn, function (req, res, next) {
        Dsl.findById(req.params.id, function (err, dsl) {
            if (err || !dsl) {
                var error = new Error('Not Found');
                error.status = 404;
                return next(error);
            }

            res.render('dsls/change', {dsl: dsl});
        });
    });

    router.put('/:id', passport.isLoggedIn, function (req, res, next) {
        Dsl.findById(req.params.id, function (err, dsl) {
            if (err || !dsl) {
                var error = new Error('Not Found');
                error.status = 404;
                return next(error);
            }

            dsl.name = req.body.name;
            dsl.description = req.body.description;

            dsl.save(function (err) {
                if (err || !dsl) {
                    req.flash("error", "Validation error");
                    console.log(err);
                    return res.render('dsls/edit', {dsl: dsl});
                }

                req.flash("info", "Successfully updated");
                res.redirect('/admin/dsls');
            });
        });
    });

    router.delete('/:id', passport.isLoggedIn, function (req, res, next) {
        Dsl.findByIdAndRemove(req.params.id, function (err, dsl) {
            req.flash("info", "Successfully deleted");
            res.redirect('/admin/dsls')
        });
    });


    // ---- DSL Interaction


    router.post("/:id/new-component", passport.isLoggedIn, function (req, res, next) {
        Dsl.findById(req.params.id, function (err, dsl) {
            if (err || !dsl) {
                var error = new Error('Not Found');
                error.status = 404;
                return next(error);
            }

            try {
                dsl.addNewComponent(req.body.model);
            } catch (e) {
                if (e instanceof ValidationException) {
                    return res.status(400).json(e.errors);
                } else {
                    return res.status(500);
                }
            }

            res.sendStatus(200);
        });
    });

    router.get("/:id/components", passport.isLoggedIn, function (req, res, next) {
        Dsl.findById(req.params.id, function (err, dsl) {
            if (err || !dsl) {
                var error = new Error('Not Found');
                error.status = 404;
                return next(error);
            }

            res.json(dsl.getComponents(req.query.type));
        });
    });

    router.put("/:id/update-info", passport.isLoggedIn, function (req, res, next) {
        Dsl.findById(req.params.id, function (err, dsl) {
            if (err || !dsl) {
                var error = new Error('Not Found');
                error.status = 404;
                return next(error);
            }

            try {
                dsl.updateInfo(req.body);
            } catch (e) {
                if (e instanceof ValidationException) {
                    return res.status(400).json(e.errors);
                } else {
                    return res.status(500);
                }
            }

            res.sendStatus(200);
        });
    });

    router.get("/:id/try", passport.isLoggedIn, function (req, res, next) {
        Dsl.findById(req.params.id, function (err, dsl) {
            if (err || !dsl) {
                var error = new Error('Not Found');
                error.status = 404;
                return next(error);
            }

            res.json({metadata: dsl.metadata, components: dsl.getComponents() });
        });
    });

    router.delete("/:id/components/:componentId", passport.isLoggedIn, function (req, res, next) {
        Dsl.findById(req.params.id, function (err, dsl) {
            if (err || !dsl) {
                var error = new Error('Not Found');
                error.status = 404;
                return next(error);
            }

            dsl.deleteComponent(req.params.componentId);
            res.sendStatus(200);
        });
    });

    return router;
};

