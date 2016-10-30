var express = require('express');
var router = express.Router();
var Solicitation = require('../models/solicitation');

module.exports = function (passport, user) {

    router.get('/dsl/:dslId', passport.isLoggedIn, user.can('access admin pages'), function (req, res, next) {
        Solicitation
            .find({dsl: req.params.dslId, status: "pending", title: new RegExp(req.query.name, "i")})
            .sort({createdDate: -1})
            //.populate("project")
            .exec(function (err, solicitations) {
                res.render('solicitations/index', {solicitations: solicitations, name: req.query.name});
            });
    });

    router.get('/:id/evaluate', passport.isLoggedIn, user.can('access admin pages'), function (req, res, next) {
        Solicitation
            .findById(req.params.id)
            .exec(function (err, solicitation) {
                res.render('solicitations/evaluate', {solicitation: solicitation});
            });
    });

    router.get('/:id', passport.isLoggedIn, user.can('access admin pages'), function (req, res, next) {
        Solicitation
            .findById(req.params.id)
            .populate("project")
            .populate("dsl")
            .exec(function (err, solicitation) {
                res.json({
                    model: solicitation.getModel(),
                    metamodel: solicitation.getMetamodel(),
                    dslMetamodel: solicitation.dsl.getMetamodel()
                });
            });
    });

    return router;
};

