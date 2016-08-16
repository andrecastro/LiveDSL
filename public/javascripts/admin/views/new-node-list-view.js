define(["views/custom/collapse-panel-view", "views/component-item-group", "joint"],
    function (CollapsePanelView, ComponentItemGroup, joint) {

        var NodeListView = Backbone.View.extend({
            className: "panel-group accordion-caret",

            render: function () {
                var basic = new joint.shapes.basic.Rect({
                    size: {width: 100, height: 30},
                    attrs: {rect: {fill: 'blue'}, text: {text: "Basic node", fill: 'white'}},
                    component: {
                        id: "basic-node",
                        friendlyName: "Basic",
                        image: "http://www.stickylife.com/images/u/853a9088913244b5a86715afc626aafe-800.png",
                        type: "NODE"
                    }
                });

                var ellipse = new joint.shapes.basic.Ellipse({
                    size: {width: 100, height: 30},
                    attrs: {text: {text: 'Ellipse', fill: 'white'}, ellipse: {fill: 'red'}},
                    component: {
                        id: "ellipse",
                        friendlyName: "Ellipse",
                        image: "http://images.clipartpanda.com/ellipse-clipart-blue-ellipse-md.png",
                        type: "NODE"
                    }
                });

                var html = new joint.shapes.basic.Rect({
                    size: {width: 100, height: 30},
                    attrs: {rect: {fill: 'green'}, text: {text: "HTML node", fill: 'white'}},
                    component: {
                        id: "html",
                        friendlyName: "HTML",
                        image: "https://1.bp.blogspot.com/-hNjVYk2JVpc/V1BXy-zYIBI/AAAAAAAAAt8/yz25h6YZoQcb_hmXflCLaFhdNgjZXj5igCLcB/s1600/html1.png",
                        type: "NODE"
                    }
                });

                var image = new joint.shapes.basic.Image({
                    size: {width: 100, height: 30},
                    attrs: {
                        image: {
                            "xlink:href": "http://crisciber162.pbworks.com/f/losango.gif",
                            width: 1, height: 1
                        },
                        text: {text: "Image node", fill: 'white'}
                    },
                    component: {
                        id: "image-node",
                        friendlyName: "Image",
                        image: "https://archive.org/services/img/image",
                        type: "NODE"
                    }
                });

                var componentItems = [];
                componentItems.push(basic);
                componentItems.push(ellipse);
                componentItems.push(html);
                componentItems.push(image);

                var nodesGroup = new ComponentItemGroup({collection: componentItems});

                var nodesCollapsePanel = new CollapsePanelView({
                    id: "nodes", title: "NODES", contentPanel: nodesGroup
                });

                this.$el.empty();
                this.$el.append(nodesCollapsePanel.render().el);

                return this;
            }
        });

        return NodeListView;
    });
