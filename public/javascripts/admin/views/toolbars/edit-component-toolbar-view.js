define(["backbone", "underscore", "text!templates/toolbars/edit-toolbar-template.html", "jquery-ui"],
    function (Backbone, _, toolbarTemplate) {

        return Backbone.View.extend({
            template: _.template(toolbarTemplate),
            className: "toolbar",

            events: {
                "click #save": "save"
            },

            initialize: function(options) {
                this.options = options;
            },

            render: function() {
                this.$el.html(this.template());
                return this;
            },

            save: function(e) {
                e.stopImmediatePropagation();

                var url = "/admin/dsls/" + currentDsl + "/new-component";
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: url,
                    data: JSON.stringify({ model: this.getComponent() }),
                    success: function() {
                        alert("Saved");
                    },
                    statusCode: {
                        400: function(res) {
                            alert(res.responseText);
                        }
                    }
                });
            },

            getComponent: function() {
                var component = graph.toJSON().cells[0];

                if (component) {
                    delete component.id;
                    delete component.position;
                }

                return component;
            }
        });
    });
