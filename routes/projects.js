var express = require('express');
var router = express.Router();
var Project = require('../models/project');
var Dsl = require('../models/dsl');
var Solicitation = require('../models/solicitation');

module.exports = function (passport) {

    router.get('/', passport.isLoggedIn, function (req, res, next) {
        Project.find({name: new RegExp(req.query.name, "i")}).where('user').equals(req.user.id).exec(
            function (err, projects) {
                res.render('projects/index', {projects: projects, name: req.query.name});
            });
    });

    router.get('/new', passport.isLoggedIn, function (req, res, next) {
        var project = new Project();

        Dsl.find(function (err, dsls) {
            res.render('projects/new', {project: project, dsls: dsls});
        });
    });

    router.post('/', passport.isLoggedIn, function (req, res, next) {
        var project = new Project({
            name: req.body.name,
            description: req.body.description,
            dsl: req.body.dsl,
            user: req.user.id
        });

        project.save(function (err) {
            if (err) {
                Dsl.find(function (err, dsls) {
                    req.flash("error", "Validation error");
                    res.render('projects/new', {project: project, dsls: dsls});
                });
                return;
            }

            req.flash("info", "Successfully saved");
            res.redirect('/projects');
        });
    });

    router.get('/edit/:id', passport.isLoggedIn, function (req, res, next) {
        Project.findById(req.params.id).where('user').equals(req.user.id).exec(function (err, project) {
            if (err || !project) {
                var error = new Error('Not Found');
                error.status = 404;
                return next(error);
            }

            Dsl.find(function (err, dsls) {
                res.render('projects/edit', {project: project, dsls: dsls});
            });
        });
    });

    router.put('/:id', passport.isLoggedIn, function (req, res, next) {
        Project.findById(req.params.id).where('user').equals(req.user.id).exec(function (err, project) {
            if (err || !project) {
                var error = new Error('Not Found');
                error.status = 404;
                return next(error);
            }

            project.name = req.body.name;
            project.description = req.body.description;

            project.save(function (err) {
                if (err) {
                    Dsl.find(function (err, dsls) {
                        req.flash("error", "Validation error");
                        res.render('projects/edit', {project: project, dsls: dsls});
                    });
                    return;
                }

                req.flash("info", "Successfully updated");
                res.redirect('/projects');
            });
        });
    });

    router.delete('/:id', passport.isLoggedIn, function (req, res, next) {
        Project.findByIdAndRemove(req.params.id).where('user').equals(req.user.id).exec(function (err, project) {
            req.flash("info", "Successfully deleted");
            res.redirect('/projects')
        });
    });

    // ---- Project Interaction

    router.get('/:id', passport.isLoggedIn, function (req, res, next) {
        Project.findById(req.params.id).where('user').equals(req.user.id).exec(function (err, project) {
            if (err || !project) {
                var error = new Error('Not Found');
                error.status = 404;
                return next(error);
            }

            res.render('projects/model', {project: project, title: project.name});
        });
    });

    router.get('/:id/modeling', passport.isLoggedIn, function (req, res, next) {
        Project.findById(req.params.id).where('user').equals(req.user.id).populate('dsl').exec(function (err, project) {
            if (err || !project) {
                var error = new Error('Not Found');
                error.status = 404;
                return next(error);
            }

            res.json({
                model: project.model,
                metamodel: project.getMetamodel(),
                dslMetamodel: project.getDslMetamodel()
            });
        });
    });

    router.put("/:id/modelling", passport.isLoggedIn, function (req, res, next) {
        Project.findById(req.params.id).where('user').equals(req.user.id).populate('dsl').exec(function (err, project) {
            if (err || !project) {
                var error = new Error('Not Found');
                error.status = 404;
                return next(error);
            }

            project.updateInfo(req.body.metamodel, req.body.model, function (err) {
                if (err) {
                    return res.status(500);
                }

                res.sendStatus(200);
            });
        });
    });

    router.post("/:id/is-metamodel-different", passport.isLoggedIn, function (req, res, next) {
        Project.findById(req.params.id).where('user').equals(req.user.id).populate('dsl').exec(function (err, project) {
            if (err || !project) {
                var error = new Error('Not Found');
                error.status = 404;
                return next(error);
            }

            res.json(project.isMetamodelDifferentFromCurrent(req.body.metamodel));
        });
    });

    router.post("/:id/solicitation", passport.isLoggedIn, function (req, res, next) {
        Project.findById(req.params.id).where('user').equals(req.user.id).exec(function (err, project) {
            if (err || !project) {
                var error = new Error('Not Found');
                error.status = 404;
                return next(error);
            }

            var solicitation = new Solicitation({
                title: req.body.title,
                description: req.body.description,
                metamodelSnapshot: project.currentMetamodel,
                project: project.id,
                dsl: project.dsl,
                status: "pending",
                createdDate: Date.now()
            });

            solicitation.save(function (err) {
                if (err) {
                    res.sendStatus(500);
                    return;
                }

                res.sendStatus(200);
            });
        });
    });

    router.post("/:id/metamodel-rollback", passport.isLoggedIn, function (req, res, next) {
        Project.findById(req.params.id).where('user').equals(req.user.id).exec(function (err, project) {
            if (err || !project) {
                var error = new Error('Not Found');
                error.status = 404;
                return next(error);
            }

            project.model = req.body.model;
            project.currentMetamodel = null;
            project.markModified('currentMetamodel');

            project.save(function (err) {
                if (err) {
                    res.sendStatus(500);
                    return;
                }

                res.sendStatus(200);
            });
        });
    });

    return router;
};

