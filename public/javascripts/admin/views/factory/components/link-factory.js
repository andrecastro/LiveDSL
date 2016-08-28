define(["joint"], function (joint) {

    return function (model, position) {
        model.source = { x: position.x, y: position.y, element: null };
        model.target = { x: position.x + 100, y: position.y, element: null };

        return new joint.dia.Link(model);
    }
});