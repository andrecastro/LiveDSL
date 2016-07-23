define(["views/factory/view-attributes/rect-attributes-view", "views/factory/view-attributes/ellipse-attributes-view",
    "views/factory/view-attributes/image-attributes-view"],
    function(RectAttributesView, EllipseAttributesView, ImageAttributesView)  {

    return function(view) {
        switch (view.model.get("type")) {
            case "basic.Rect":
                return new RectAttributesView({ cellView: view });
            case "basic.Ellipse":
                return new EllipseAttributesView({ cellView: view });
            case "basic.Image":
                return new ImageAttributesView({ cellView: view });
        }
    }
});