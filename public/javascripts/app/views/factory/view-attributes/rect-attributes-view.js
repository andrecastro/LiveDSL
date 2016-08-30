define(["underscore", "app-views/factory/view-attributes/attributes-view", "views/custom/collapse-panel-view",
        "text!app-templates/attributes/rect-appearance.html"],
    function(_, AttributesView, CollapsePanelView, rectAppearanceTemplate) {

        var RectAttributesView = AttributesView.extend({

        renderAppearance: function() {
            var appearanceContentPanel = _.template(rectAppearanceTemplate);
            var appearanceAttr = new CollapsePanelView({
                title: "APPEARANCE",
                id: "appearance",
                contentPanel: appearanceContentPanel()
            });

            this.$el.append(appearanceAttr.render().el);

            this.bindInputToNestedField("#color", "attrs", "rect/fill", "STRING");
            this.bindInputToNestedField("#stroke-color", "attrs", "rect/stroke", "STRING");
        }
    });

    return RectAttributesView;
});