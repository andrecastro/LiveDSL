requirejs.config({
    baseUrl: "/vendor/",
    packages: [
        {
            name: 'jquery',
            location: 'jquery/dist',
            main: 'jquery.min'
        },
        {
            name: 'sizzle',
            location: 'jquery/external/sizzle/dist',
            main: 'sizzle'
        },
        {
            name: 'lodash',
            location: 'lodash-amd'
        },
        {
            name: 'text',
            location: 'text',
            main: "text"
        }
    ],
    paths: {
        "bootstrap" : "bootstrap/dist/js/bootstrap.min",
        "bootstrap-ui" : "bootstrap.ui/dist/js/bootstrap-ui.min",
        "moment": "moment/min/moment-with-locales.min",
        "bootstrap-datepicker": "eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min",
        "select2": "select2/select2.min",
        "backbone" : "backbone/backbone-min",
        "backbone-undo": "Backbone.Undo.js/Backbone.Undo",
        "backbone-stickit": "backbone.stickit/backbone.stickit",
        "joint": "jointjs/dist/joint",
        "geometry": "jointjs/dist/geometry",
        "jquery-ui": "jquery-ui/jquery-ui",
        "jquery-ui-touch": "jquery-ui-touch-punch/jquery.ui.touch-punch",
        "jquery-ui-layout": "jquery-ui-layout-latest/jquery.layout-latest",
        "moment-global": "../javascripts/custom/moment-global", // makes the moment library be visible in the global scope
        "models": "/javascripts/admin/models",
        "views": "/javascripts/admin/views",
        "templates": "/javascripts/admin/templates",
        "custom": "/javascripts/custom",
        "scripts": "/javascripts"
    },
    map: {
        '*': {
            // Backbone requires underscore. This forces requireJS to load lodash instead:
            'underscore': 'lodash'
        }
    },
    shim: {
        "jquery-ui-touch": {
            deps: ["jquery", "jquery-ui"]
        },
        "jquery-ui-layout": {
            deps: ['jquery-ui-touch']
        },
        "bootstrap": {
            deps: ["jquery"]
        },
        "select2": {
            deps: ["jquery"]
        },
        "bootstrap-ui": {
            deps: ["bootstrap", "moment-global", "bootstrap-datepicker", "select2"]
        }
    }
});

require(["views/layout/center", "views/layout/west", "scripts/admin/admin-graph", "backbone-undo",
        "jquery-ui-layout", "bootstrap-ui"],
    function (Center, West, AdminGraph, UndoManager) {

        $('#main').layout({
            resizable: true,
            applyDefaultStyles: true,
            west: {size: 200},
            east: {size: 300},
            south: {size: 150, initClosed: true}
        });

        $('#east').layout({
            resizable: false,
            applyDefaultStyles: true,
            south: {size: 150, closable: false}
        });

        window.graph = new AdminGraph();

        window.center = new Center({
            model: graph
        }).render();

        window.west = new West().render();

        var smallCenter = new Center({
            el: $("#preview"),
            height: 600,
            width: 600,
            gridSize: 1,
            model: graph
        });
        smallCenter.scale(.2);
        smallCenter.$el.css('pointer-events', 'none');

        var myUndoManager = new UndoManager({
            register: [graph], // pass an object or an array of objects
            track: true // changes will be tracked right away
        });

        var changing = false;
        var resizing = false;
        var beforeCache = graph.toJSON();

        graph.on("batch:start", function (event) {
            if (event && (event.batchName == 'add' || event.batchName == 'remove')) {
                beforeCache = graph.toJSON();
            }
        }).on("batch:stop", function (event) {
            if (event && event.batchName == 'resizing') {
                resizing = false;
            }

            if (changing && !resizing) { // needs to be changing and not resizing
                changing = false;
                graph.trigger('undoManager', graph, changing);
            }
        }).on('change:position change:z change:vertices change:source change:target', function () {
            if (!changing) {
                changing = true;
                graph.trigger('undoManager', graph, changing);
            }
        }).on('change:resizing', function () {
            if (!changing) {
                changing = true;
                resizing = true;
                graph.trigger('undoManager', graph, changing);
            }
        }).on("add remove", function () {
            if (!changing) {
                changing = true;
                graph.trigger('undoManager', graph, changing, {beforeCache: beforeCache});
            }
        });

        UndoManager.removeUndoType(["change", "add", "reset", "remove"]);
        UndoManager.addUndoType("undoManager", {
            "on": function (model, isChanging, options) {
                if (isChanging) {
                    if (options) {
                        beforeCache = options.beforeCache || model.toJSON();
                    } else {
                        beforeCache = model.toJSON();
                    }
                } else {
                    return {
                        "object": model,
                        "before": beforeCache,
                        "after": model.toJSON()
                    };
                }
            },
            "undo": function (model, before, after, options) {
                model.set(before);
            },
            "redo": function (model, before, after, options) {
                model.set(after);
            }
        });

        $("#undo").click(function () {
            myUndoManager.undo();
            center.trigger("attributes:remove_others");
        });


        $("#redo").click(function () {
            myUndoManager.redo();
            center.trigger("attributes:remove_others");
        });


    });