define(["backbone", "underscore", "views/component-item-view"],
    function (Backbone, _, ComponentItemView) {


        var ComponentItemGroup = Backbone.View.extend({
            className: "list-group list-group-nested",

            initialize: function(options) {
                this.options = options;
            },

            render: function() {
                this.$el.empty();
                _.each(this.collection, this.renderItemView, this);
                return this;
            },

            renderItemView: function(item) {
                this.$el.append(this.toComponentItemView(item).render().el)
            },

            toComponentItemView: function(componentItem) {
                return new ComponentItemView({ model: componentItem , enableDelete: this.options.enableDelete });
            }
        });

        return ComponentItemGroup;
    });
