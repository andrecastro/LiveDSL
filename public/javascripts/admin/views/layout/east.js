define(["backbone"], function (Backbone) {

    var East = Backbone.View.extend({
        el: $("#east"),
        initialize: function(options) {
            this.options = options;
        },
        render: function () {
            this.$("#preview").empty();
            this.$("#east-content").empty();
            var smallPaper = new this.options.Paper({
                el: this.$("#preview"),
                height: 600,
                width: 600,
                gridSize: 1,
                model: this.model
            });

            smallPaper.scale(.2);
            smallPaper.$el.css('pointer-events', 'none');

            return this;
        },

        renderAttributes: function(attributesView) {
            this.$("#east-content").html(attributesView.render().el);
        }
    });

    return East;
});
