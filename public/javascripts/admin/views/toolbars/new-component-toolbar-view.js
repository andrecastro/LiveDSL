define(["backbone", "underscore", "text!admin-templates/toolbars/new-toolbar-template.html",
        "custom/pnotify-bootstrap"],
    function (Backbone, _, toolbarTemplate, notify) {

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
                var currentComponent = this.getComponent();
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: url,
                    data: JSON.stringify({ model:  currentComponent }),
                    success: function() {
                        notify("success", 'Successfully saved!');
                        window.router.navigate("/", {trigger: true});
                    },
                    statusCode: {
                        400: function(res) {
                            var errorMessage = res.responseJSON.map(function(error) { return "- " + error; }).join("\n");
                            notify("error", errorMessage);
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
