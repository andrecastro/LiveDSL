define(["backbone"], function (Backbone) {

    var Center = Backbone.View.extend({
        el: $("#center"),
        initialize: function (options) {
            this.options = options;
        },
        render: function () {
            this.$el.empty();

            if (this.$el.data('uiDroppable')) {
                this.$el.droppable("destroy");
            }

            this.paper = new this.options.Paper({
                el: this.$el,
                model: this.model
            });


            this.paper.render();
            return this;
        }
    });

    return Center;
});
