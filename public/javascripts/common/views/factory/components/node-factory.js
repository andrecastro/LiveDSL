define(["joint"], function(joint) {

    return function(model, position) {

        model.position = { x: position.x, y: position.y };

        switch (model.type) {
            case "basic.Rect":
                return new joint.shapes.basic.Rect(model);
            case "basic.Ellipse":
                return new joint.shapes.basic.Ellipse(model);
            case "basic.Image":
                return new joint.shapes.basic.Image(model);
        }
    }
});