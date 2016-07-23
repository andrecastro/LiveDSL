define(["backbone", "underscore", "views/component-item-view", "views/custom/collapse-panel-view",
        "models/component-item"],
    function (Backbone, _, ComponentItemView, CollapsePanelView, ComponentItem) {


        var ComponentItemGroup = Backbone.View.extend({
            className: "list-group list-group-nested",

            render: function() {
                this.$el.empty();
                _.each(this.collection, this.renderItemView, this);

                return this;
            },

            renderItemView: function(item) {
                this.$el.append(this.toComponentItemView(item).render().el)
            },

            toComponentItemView: function(componentItem) {
                return new ComponentItemView({model: componentItem});
            }

        });

        var ComponentListView = Backbone.View.extend({
            className: "panel-group accordion-caret",

            render: function () {
                var nodesGroup = new ComponentItemGroup({ collection: _.filter(this.collection, ComponentItem.isNode) });
                var linksGroup = new ComponentItemGroup({ collection: _.filter(this.collection, ComponentItem.isLink) });
                var relationshipsGroup = new ComponentItemGroup({ collection: _.filter(this.collection,
                    ComponentItem.isRelationshipLink) });

                var nodesCollapsePanel = new CollapsePanelView({id: "nodes", title: "NODES", contentPanel: nodesGroup });
                var linksCollapsePanel = new CollapsePanelView({id: "links", title: "LINKS", contentPanel: linksGroup });
                var relationshipCollapsePanel = new CollapsePanelView({id: "relationship", title: "RELATIONSHIPS",
                    contentPanel: relationshipsGroup });

                this.$el.append(nodesCollapsePanel.render().el);
                this.$el.append(linksCollapsePanel.render().el);
                this.$el.append(relationshipCollapsePanel.render().el);

                return this;
            }
        });

        // Nodes
        var basicNode = new ComponentItem({
            title: "Basic node",
            type: "NODE",
            imageUrl: "http://www.stickylife.com/images/u/853a9088913244b5a86715afc626aafe-800.png",
            element: "BASIC"
        });
        var ellipseNode = new ComponentItem({
            title: "Ellipse node",
            type: "NODE",
            imageUrl: "http://images.clipartpanda.com/ellipse-clipart-blue-ellipse-md.png",
            element: "ELLIPSE"
        });
        var htmlNode = new ComponentItem({
            title: "Html node",
            type: "NODE",
            imageUrl: "https://1.bp.blogspot.com/-hNjVYk2JVpc/V1BXy-zYIBI/AAAAAAAAAt8/yz25h6YZoQcb_hmXflCLaFhdNgjZXj5igCLcB/s1600/html1.png",
            element: "HTML"
        });
        var imageNode = new ComponentItem({
            title: "Image node",
            type: "NODE",
            imageUrl: "https://archive.org/services/img/image",
            element: "IMAGE"
        });

        // Links
        var basicLink = new ComponentItem({
            title: "Basic link",
            type: "LINK",
            imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/ArrowCross.svg/2000px-ArrowCross.svg.png",
            element: "BASIC"
        });

        // Relationship Links
        var hasManyLink = new ComponentItem({
            title: "Has many",
            type: "RELATIONSHIP_LINK",
            imageUrl: "https://mutual.com.br/wp-content/themes/kraken/images/losango-branco-100.png",
            element: "HAS_MANY"
        });
        var isALink = new ComponentItem({
            title: "Is a",
            component: "RELATIONSHIP_LINK",
            imageUrl: "http://2.bp.blogspot.com/-Sn7qOA219fA/U02pjE7lFkI/AAAAAAAAAbM/3InAqtvmpao/s1600/Triangulo.png",
            element: "IS_A"
        });
        var hasOneLink = new ComponentItem({
            title: "Has one",
            type: "RELATIONSHIP_LINK",
            imageUrl: "http://iconshow.me/media/images/ui/ios7-icons/png/512/chevron-right.png",
            element: "HAS_ONE"
        });

        var componentItems = [];
        componentItems.push(basicNode);
        componentItems.push(ellipseNode);
        componentItems.push(htmlNode);
        componentItems.push(imageNode);
        componentItems.push(basicLink);
        componentItems.push(hasManyLink);
        componentItems.push(isALink);
        componentItems.push(hasOneLink);

        return new ComponentListView({collection: componentItems});
    });
