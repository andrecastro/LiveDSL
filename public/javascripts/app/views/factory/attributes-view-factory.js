define(["app-views/factory/view-attributes/rect-attributes-view",
        "app-views/factory/view-attributes/ellipse-attributes-view",
        "app-views/factory/view-attributes/image-attributes-view",
        "app-views/factory/view-attributes/link-attributes-view"],
    function(RectAttributesView, EllipseAttributesView, ImageAttributesView, LinkAttributesView)  {

    return function(view) {
        switch (view.model.get("type")) {
            case "basic.Rect":
                return new RectAttributesView({ cellView: view });
            case "basic.Ellipse":
                return new EllipseAttributesView({ cellView: view });
            case "basic.Image":
                return new ImageAttributesView({ cellView: view });
            case "link":
                return new LinkAttributesView({ cellView: view });
        }
    }
});