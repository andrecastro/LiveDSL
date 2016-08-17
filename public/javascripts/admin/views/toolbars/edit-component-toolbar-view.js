define(["backbone", "underscore", "text!templates/toolbars/edit-toolbar-template.html",
        "scripts/custom/pnotify-bootstrap"],
    function (Backbone, _, toolbarTemplate, notify) {

        return Backbone.View.extend({
            template: _.template(toolbarTemplate),
            className: "toolbar",

            events: {
                "click #save": "save",
                "click #remove": "remove"
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
                var componentId = this.options.componentId;
                var url = "/admin/dsls/" + currentDsl + "/components/" + componentId;
                $.ajax({
                    type: "PUT",
                    contentType: "application/json",
                    url: url,
                    data: JSON.stringify({ model: this.getComponent() }),
                    success: function() {
                        notify("success", 'Successfully saved!');
                        Backbone.history.loadUrl(Backbone.history.fragment)
                    },
                    statusCode: {
                        400: function(res) {
                            var errorMessage = res.responseJSON.map(function(error) { return "- " + error; }).join("\n");
                            notify("error", errorMessage);
                        }
                    }
                });
            },

            remove: function(e) {
                e.stopImmediatePropagation();

                var componentId = this.options.componentId;

                notify("confirmation", 'Are you sure?').get().on('pnotify.confirm', function(){
                    var url = "/admin/dsls/" + currentDsl + "/components/" + componentId;
                    $.ajax({
                        type: "DELETE",
                        contentType: "application/json",
                        url: url,
                        success: function() {
                            notify("success", 'Successfully deleted!');
                            window.router.navigate("/", {trigger: true});
                        }
                    }).on('pnotify.cancel', function(){});
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
