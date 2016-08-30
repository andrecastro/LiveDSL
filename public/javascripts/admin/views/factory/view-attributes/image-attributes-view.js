define(["underscore", "admin-views/factory/view-attributes/attributes-view", "views/custom/collapse-panel-view",
    "text!admin-templates/attributes/image-appearance.html"],
    function(_, AttributesView, CollapsePanelView, imageAppearanceTemplate) {
    var ImageAttributesView = AttributesView.extend({
        renderAppearance: function() {
            var appearanceContentPanel = _.template(imageAppearanceTemplate);
            var appearanceAttr = new CollapsePanelView({
                title: "APPEARANCE",
                id: "appearance",
                contentPanel: appearanceContentPanel()
            });

            this.$el.append(appearanceAttr.render().el);

            this.bindInputToNestedField("#image", "attrs", "image/xlink:href", "STRING");
        }
    });
    return ImageAttributesView;
});