define(["backbone", "jquery-ui"],
    function (Backbone) {

        var West =  Backbone.View.extend({
            el: $("#west"),

            initialize: function(options) {
                this.options = options;
            },

            render: function() {
                this.$("#west-content").empty();
                this.$("#west-content").append(this.options.toolbar.render().el);
                this.options.toolbar.delegateEvents();

                //this.$("#west-content").append(this.options.listView.render().el);

                return this;
            }
        });

        return West;
    });
