define(["views/layout/center", "views/layout/west", "joint", "backbone-undo", "jquery-ui-layout", "bootstrap-ui"],
    function (Center, West, joint, UndoManager) {

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

        window.graph = new joint.dia.Graph;

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