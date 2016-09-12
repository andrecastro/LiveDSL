define(["joint"], function (joint) {

    return function (model, position) {
        model.source = { x: position.x, y: position.y};
        model.target = { x: position.x + 100, y: position.y};

        return new joint.dia.Link(model);
    }
});