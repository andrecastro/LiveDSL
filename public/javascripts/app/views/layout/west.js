define(["backbone", "underscore", "views/component-list-view", "jquery-ui"],
    function (Backbone, _, componentListView) {

        var West =  Backbone.View.extend({
            el: $("#west"),

            render: function() {
                this.$el.html(componentListView.render().el);
                this.$(".component-item").draggable({
                    cursor: "move",
                    helper: function () {
                        return $(this).clone().appendTo('body').css('zIndex', 5).show();
                    }
                });

                return this;
            }
        });

        return West;
    });
