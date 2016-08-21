define(["views/custom/collapse-panel-view", "views/component-item-group", "joint"],
    function (CollapsePanelView, ComponentItemGroup, joint) {

        var LinkListView = Backbone.View.extend({
            className: "panel-group accordion-caret",

            render: function () {
                var basicLink = new joint.dia.Link({
                    smooth: false,
                    attrs: {
                        '.connection': { stroke: 'blue' , 'stroke-width': 3, 'stroke-dasharray': '0'},
                        '.marker-source': { stroke: 'blue', fill: 'red', d: 'M 10 0 L 0 5 L 10 10 z' },
                        '.marker-target': { stroke: 'blue', fill: 'yellow', d: 'M 10 0 L 0 5 L 10 10 z' }
                    },
                    component: {
                        id: "basic-link",
                        friendlyName: "Basic",
                        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/ArrowCross.svg/2000px-ArrowCross.svg.png",
                        type: "LINK"
                    },
                    labels: [
                        { position: 0.5, attrs: { text: { text: 'label' } } }
                    ]
                });

                var componentItems = [];
                componentItems.push(basicLink);

                var linksGroup = new ComponentItemGroup({ collection: componentItems });

                var linksCollapsePanel = new CollapsePanelView({
                    id: "links", title: "LINKS", contentPanel: linksGroup
                });

                this.$el.empty();
                this.$el.append(linksCollapsePanel.render().el);

                return this;
            }
        });

        return LinkListView;
    });

