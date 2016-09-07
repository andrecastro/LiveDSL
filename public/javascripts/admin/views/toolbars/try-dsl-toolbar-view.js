define(["backbone", "underscore", "text!admin-templates/toolbars/try-dsl-toolbar-template.html",
        "controllers/dsl_client", "custom/pnotify-bootstrap"],
    function (Backbone, _, toolbarTemplate, Dsls, notify) {

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
                this.$('[data-toggle="tooltip"]').tooltip();
                return this;
            },

            save: function(e) {
                e.stopImmediatePropagation();

                var components = window.components;
                var metadata = window.graph.toJSON();

                Dsls.updateInfo(components, metadata, function() {
                    notify("success", 'Successfully saved!');
                }, function(res) {
                    var errorMessage = res.responseJSON.map(function(error) { return "- " + error; }).join("\n");
                    notify("error", errorMessage);
                });
            }
        });
    });
