define(["underscore", "admin-views/factory/view-attributes/attributes-view", "views/custom/collapse-panel-view",
        "text!admin-templates/attributes/ellipse-appearance.html"],
    function(_, AttributesView, CollapsePanelView, ellipseAppearanceTemplate) {

        var EllipseAttributesView = AttributesView.extend({

            renderAppearance: function() {
                var appearanceContentPanel = _.template(ellipseAppearanceTemplate);
                var appearanceAttr = new CollapsePanelView({
                    title: "APPEARANCE",
                    id: "appearance",
                    contentPanel: appearanceContentPanel()
                });

                this.$el.append(appearanceAttr.render().el);

                this.bindInputToNestedField("#color", "attrs", "ellipse/fill", "STRING");
                this.bindInputToNestedField("#stroke-color", "attrs", "ellipse/stroke", "STRING");
            }
        });

        return EllipseAttributesView;
    });