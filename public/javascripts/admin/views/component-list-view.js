define(["backbone", "underscore", "views/component-item-view",
        "models/component-item", "text!templates/component-list-view.html"],
    function (Backbone, _,ComponentItemView, ComponentItem, componentListViewTemplate) {

        var ComponentListView =  Backbone.View.extend({
            template: _.template(componentListViewTemplate),

            render: function() {
                this.$el.html(this.template());
                _.each(this.collection, this.renderItem, this);
                return this;
            },

            renderItem: function(componentItem) {
                var componentItemView = new ComponentItemView({ model: componentItem });

                if (componentItem.get("type") == "NODE") {
                    this.$("#nodes-content .list-group").append(componentItemView.render().el);
                } else if (componentItem.get("type") == "LINK") {
                    this.$("#links-content .list-group").append(componentItemView.render().el);
                } else {
                    this.$("#links-relationship-content .list-group").append(componentItemView.render().el);
                }
            }
        });

        // Nodes
        var basicNode = new ComponentItem({ title: "Basic node", type: "NODE", imageUrl: "http://www.stickylife.com/images/u/853a9088913244b5a86715afc626aafe-800.png" });
        var ellipseNode = new ComponentItem({ title: "Ellipse node", type: "NODE", imageUrl: "http://images.clipartpanda.com/ellipse-clipart-blue-ellipse-md.png" });
        var htmlNode = new ComponentItem({ title: "Html node", type: "NODE", imageUrl: "https://1.bp.blogspot.com/-hNjVYk2JVpc/V1BXy-zYIBI/AAAAAAAAAt8/yz25h6YZoQcb_hmXflCLaFhdNgjZXj5igCLcB/s1600/html1.png" });
        var imageNode = new ComponentItem({ title: "Image node", type: "NODE", imageUrl: "https://archive.org/services/img/image" });

        // Links
        var basicLink = new ComponentItem({ title: "Basic link", type: "LINK", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/ArrowCross.svg/2000px-ArrowCross.svg.png" });

        // Relationship Links
        var hasManyLink = new ComponentItem({ title: "Has many", type: "LINK-RELATIONSHIP", imageUrl: "https://mutual.com.br/wp-content/themes/kraken/images/losango-branco-100.png" });
        var isALink = new ComponentItem({ title: "Is a", type: "LINK-RELATIONSHIP", imageUrl: "http://2.bp.blogspot.com/-Sn7qOA219fA/U02pjE7lFkI/AAAAAAAAAbM/3InAqtvmpao/s1600/Triangulo.png" });
        var hasOneLink = new ComponentItem({ title: "Has one", type: "LINK-RELATIONSHIP", imageUrl: "http://iconshow.me/media/images/ui/ios7-icons/png/512/chevron-right.png" });

        var componentItems = [];
        componentItems.push(basicNode);
        componentItems.push(ellipseNode);
        componentItems.push(htmlNode);
        componentItems.push(imageNode);
        componentItems.push(basicLink);
        componentItems.push(hasManyLink);
        componentItems.push(isALink);
        componentItems.push(hasOneLink);

        return new ComponentListView({ collection: componentItems });
});
