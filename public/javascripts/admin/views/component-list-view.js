define(["backbone", "underscore", "views/component-item-view", "views/custom/collapse-panel-view",
        "views/component-item-group", "views/factory/component-factory"],
    function (Backbone, _, ComponentItemView, CollapsePanelView, ComponentItemGroup, componentFactory) {


        var ComponentListView = Backbone.View.extend({
            className: "panel-group accordion-caret",

            render: function () {
                var self = this;

                $.ajax({
                    url: "/admin/dsls/" + currentDsl + "/components",
                    async: false,
                    success: function (res) {
                        self.renderView(res, self);
                    }
                });

                return this;
            },

            renderView: function(response, context) {
                var components = [];
                for(var componentIndex in response) {
                    components.push(componentFactory(response[componentIndex], {}));
                }

                var nodesGroup = new ComponentItemGroup({
                    collection: _.filter(components, function (component) {
                        return !component.isLink();
                    }),
                    edit: true
                });

                var linksGroup = new ComponentItemGroup({
                    collection: _.filter(components, function (component) {
                        return component.isLink();
                    }),
                    edit: true
                });

                var nodesCollapsePanel = new CollapsePanelView({
                    id: "nodes", title: "NODES", link: "#new-node",
                    contentPanel: nodesGroup
                });

                var linksCollapsePanel = new CollapsePanelView({
                    id: "links", link: "#new-link", title: "LINKS",
                    contentPanel: linksGroup
                });

                context.$el.empty();
                context.$el.append(nodesCollapsePanel.render().el);
                context.$el.append(linksCollapsePanel.render().el);
            }
        });


        return ComponentListView;
    });
