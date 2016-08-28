define(["backbone", "underscore", "views/custom/collapse-panel-view", "views/component-item-group"],
    function (Backbone, _, CollapsePanelView, ComponentItemGroup) {


        var ComponentListView = Backbone.View.extend({
            className: "panel-group accordion-caret",
            options: {
                showNodes: true,
                showLinks: true,
                enableDelete: false,
                enableNew: false
            },
            initialize: function (options) {
                this.options = _.extend({}, _.result(this, 'options'), options || {});
            },

            render: function () {
                var nodes = _.filter(this.collection, function (component) {
                    return component.component.type == "NODE";
                });

                var links = _.filter(this.collection, function (component) {
                    return component.component.type == "LINK";
                });

                this.$el.empty();

                if (this.options.showNodes) {
                    var nodesGroup = new ComponentItemGroup({
                        collection: nodes,
                        enableDelete: this.options.enableDelete
                    });

                    var nodesCollapsePanel = new CollapsePanelView({
                        id: "nodes", title: "NODES", link: this.options.enableNew ? "#new-node" : false,
                        contentPanel: nodesGroup
                    });

                    this.$el.append(nodesCollapsePanel.render().el);
                }

                if (this.options.showLinks) {
                    var linksGroup = new ComponentItemGroup({
                        collection: links,
                        enableDelete: this.options.enableDelete
                    });

                    var linksCollapsePanel = new CollapsePanelView({
                        id: "links", title: "LINKS", link: this.options.enableNew ? "#new-link" : false,
                        contentPanel: linksGroup
                    });

                    this.$el.append(linksCollapsePanel.render().el);
                }

                return this;
            }
        });


        return ComponentListView;
    });
