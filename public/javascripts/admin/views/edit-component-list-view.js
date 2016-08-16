define(["backbone", "underscore", "views/component-item-view", "views/custom/collapse-panel-view",
        "views/component-item-group", "views/factory/component-factory"],
    function (Backbone, _, ComponentItemView, CollapsePanelView, ComponentItemGroup, componentFactory) {


        return Backbone.View.extend({
            className: "panel-group accordion-caret",

            initialize: function(options) {
                this.options = options;
            },

            render: function () {
                var self = this;

                $.ajax({
                    url: "/admin/dsls/" + currentDsl + "/components/" + this.options.id,
                    async: false,
                    success: function (res) {
                        self.renderView(res, self);
                    }
                });

                return this;
            },

            renderView: function (componentJson, context) {
                this.component = componentFactory(componentJson, { x: 400, y: 300 });
                var components = [this.component];

                var componentGroup = new ComponentItemGroup({
                    collection: components
                });

                var componentCollapsePanel = new CollapsePanelView({
                    id: "component", title: "EDITING " + componentJson.component.type, contentPanel: componentGroup
                });

                context.$el.empty();
                context.$el.append(componentCollapsePanel.render().el);
            },

            getEditingComponent: function() {
                return this.component;
            }
        });
    });
