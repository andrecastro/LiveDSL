define(["backbone", "jquery-ui"],
    function (Backbone, ToolbarView) {

        var West =  Backbone.View.extend({
            el: $("#west"),

            initialize: function(options) {
                this.options = options;
            },

            render: function() {
                this.$el.empty();
                this.$el.append(this.options.toolbar.render().el);
                this.$el.append(this.options.listView.render().el);

                if (this.$(".component-item").data('uiDraggable')) {
                    this.$(".component-item").draggable("destroy");
                }

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
