define(["backbone", "underscore", "text!app-templates/toolbars/new-model-toolbar.html",
        "custom/pnotify-bootstrap", "controllers/projects"],
    function (Backbone, _, toolbarTemplate, notify, Projects) {

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

                var model = window.graph.toJSON();

                Projects.saveModel(model, function () {
                    notify("success", 'Successfully saved!');
                }, function(res) {
                    var errorMessage = res.responseJSON.map(function (error) {
                        return "- " + error;
                    }).join("\n");
                    notify("error", errorMessage);
                });
            }
        });
    });
