define(["backbone", "underscore", "text!templates/toolbars/try-dsl-toolbar-template.html",
        "scripts/custom/pnotify-bootstrap"],
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

                var url = "/admin/dsls/" + currentDsl + "/update-info";
                var components = window.components;
                var metadata = window.graph.toJSON();

                $.ajax({
                    type: "PUT",
                    contentType: "application/json",
                    url: url,
                    data: JSON.stringify({ components:  components,  metadata: JSON.stringify(metadata) }),
                    success: function() {
                        notify("success", 'Successfully saved!');
                    },
                    statusCode: {
                        400: function(res) {
                            var errorMessage = res.responseJSON.map(function(error) { return "- " + error; }).join("\n");
                            notify("error", errorMessage);
                        }
                    }
                });
            }
        });
    });
