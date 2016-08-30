define(["backbone"], function (Backbone) {

    var Center = Backbone.View.extend({
        el: $("#center"),
        initialize: function (options) {
            this.options = options;
        },
        render: function () {
            this.$("#center-content").empty();
            this.$("#center-title").html(this.options.title);

            if (this.$("#center-content").data('uiDroppable')) {
                this.$("#center-content").droppable("destroy");
            }

            this.$("#center-content").html(this.options.paper.render().$el);
            return this;
        }
    });

    return Center;
});
