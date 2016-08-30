define(["admin-views/factory/view-attributes/rect-attributes-view",
        "admin-views/factory/view-attributes/ellipse-attributes-view",
        "admin-views/factory/view-attributes/image-attributes-view",
        "admin-views/factory/view-attributes/link-attributes-view"],
    function(RectAttributesView, EllipseAttributesView, ImageAttributesView, LinkAttributesView)  {

    return function(view, options) {
        options = options || {};
        options.cellView = view;

        switch (view.model.get("type")) {
            case "basic.Rect":
                return new RectAttributesView(options);
            case "basic.Ellipse":
                return new EllipseAttributesView(options);
            case "basic.Image":
                return new ImageAttributesView(options);
            case "link":
                return new LinkAttributesView(options);
        }
    }
});