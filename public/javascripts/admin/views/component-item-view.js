define(["backbone", "underscore", "models/component-item","text!templates/component-item-view.html"],
    function(Backbone, _, ComponentItem, componentItemTemplate) {

        return Backbone.View.extend({
            model: ComponentItem,
            template: _.template(componentItemTemplate),

            render: function() {
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            }
        });
    });