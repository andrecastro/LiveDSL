define(["underscore", "app-views/factory/view-attributes/attributes-view",
        "views/custom/collapse-panel-view",
        "text!app-templates/attributes/link-connection-attributes.html",
        "text!app-templates/attributes/link-source-target-attributes.html",
        "text!app-templates/attributes/link-restrictions-attributes.html"],
    function(_, AttributesView, CollapsePanelView, linkConnectionTemplate, linkSourceTargetTemplate,
             linkRestrictionsTemplate) {

        var LinkAttributesView = AttributesView.extend({

            render: function() {
                this.$el.empty();
                this.renderConnection();
                this.renderSource();
                this.renderTarget();
                this.stickit();
                return this;
            },

            renderConnection: function() {
                var linkConnectionContentPanel = _.template(linkConnectionTemplate);
                var connectionAttr = new CollapsePanelView({
                    title: "CONNECTION",
                    id: "connection",
                    contentPanel: linkConnectionContentPanel()
                });

                this.$el.append(connectionAttr.render().el);

                this.bindInputToNestedField("#label", "labels", "0/attrs/text/text", "STRING");
                this.bindInputToNestedField("#stroke-color", "attrs", ".connection/stroke", "STRING");
                this.bindInputToNestedField("#stroke-width", "attrs", ".connection/stroke-width", "NUMBER");
                this.bindInputToNestedField("#stroke-dasharray", "attrs", ".connection/stroke-dasharray", "STRING");
            },

            renderSource: function() {
                var contentPanel = _.template(linkSourceTargetTemplate);
                var connectionAttr = new CollapsePanelView({
                    title: "SOURCE",
                    id: "source",
                    contentPanel: contentPanel({ attr: "source" })
                });

                this.$el.append(connectionAttr.render().el);
                this.bindInputToNestedField("#source-fill-color", "attrs", ".marker-source/fill", "STRING");
                this.bindInputToNestedField("#source-stroke-color", "attrs", ".marker-source/stroke", "STRING");
                this.bindInputToNestedField("#source-d", "attrs", ".marker-source/d", "STRING");
            },

            renderTarget: function() {
                var contentPanel = _.template(linkSourceTargetTemplate);
                var connectionAttr = new CollapsePanelView({
                    title: "TARGET",
                    id: "target",
                    contentPanel: contentPanel({ attr: "target" })
                });

                this.$el.append(connectionAttr.render().el);

                this.bindInputToNestedField("#target-fill-color", "attrs", ".marker-target/fill", "STRING");
                this.bindInputToNestedField("#target-stroke-color", "attrs", ".marker-target/stroke", "STRING");
                this.bindInputToNestedField("#target-d", "attrs", ".marker-target/d", "STRING");
            }
        });

        return LinkAttributesView;
    });