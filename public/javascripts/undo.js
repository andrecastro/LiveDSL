//var myUndoManager = new UndoManager({
//    register: [graph], // pass an object or an array of objects
//    track: true // changes will be tracked right away
//});
//
//var changing = false;
//var resizing = false;
//var beforeCache = graph.toJSON();
//
//graph.on("batch:start", function (event) {
//    if (event && (event.batchName == 'add' || event.batchName == 'remove')) {
//        beforeCache = graph.toJSON();
//    }
//}).on("batch:stop", function (event) {
//    if (event && event.batchName == 'resizing') {
//        resizing = false;
//    }
//
//    if (changing && !resizing) { // needs to be changing and not resizing
//        changing = false;
//        graph.trigger('undoManager', graph, changing);
//    }
//}).on('change:position change:z change:vertices change:source change:target', function () {
//    if (!changing) {
//        changing = true;
//        graph.trigger('undoManager', graph, changing);
//    }
//}).on('change:resizing', function () {
//    if (!changing) {
//        changing = true;
//        resizing = true;
//        graph.trigger('undoManager', graph, changing);
//    }
//}).on("add remove", function () {
//    if (!changing) {
//        changing = true;
//        graph.trigger('undoManager', graph, changing, {beforeCache: beforeCache});
//    }
//});
//
//UndoManager.removeUndoType(["change", "add", "reset", "remove"]);
//UndoManager.addUndoType("undoManager", {
//    "on": function (model, isChanging, options) {
//        if (isChanging) {
//            if (options) {
//                beforeCache = options.beforeCache || model.toJSON();
//            } else {
//                beforeCache = model.toJSON();
//            }
//        } else {
//            return {
//                "object": model,
//                "before": beforeCache,
//                "after": model.toJSON()
//            };
//        }
//    },
//    "undo": function (model, before, after, options) {
//        model.set(before);
//    },
//    "redo": function (model, before, after, options) {
//        model.set(after);
//    }
//});
//
//$("#undo").click(function () {
//    myUndoManager.undo();
//    center.trigger("attributes:remove_others");
//});
//
//
//$("#redo").click(function () {
//    myUndoManager.redo();
//    center.trigger("attributes:remove_others");
//});