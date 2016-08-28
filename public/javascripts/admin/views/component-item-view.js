define(["backbone", "underscore", "text!templates/component-item-view.html", "scripts/custom/pnotify-bootstrap",
        "controller/components"],
    function (Backbone, _, componentItemTemplate, notify, Components) {

        return Backbone.View.extend({
            template: _.template(componentItemTemplate),
            className: "list-group-item",
            events: {
                "click .delete": "delete"
            },

            initialize: function(options) {
                this.options = options;
            },

            render: function () {
                this.$el.html(this.template({ model: this.getComponent(), enableDelete: this.options.enableDelete }));
                return this;
            },

            getComponent: function() {
                var component = this.model;
                delete component.id;
                return component;
            },

            delete: function(e) {
                e.stopImmediatePropagation();

                var componentId = this.model.component.id;

                notify("confirmation", 'Are you sure?').get().on('pnotify.confirm', function(){

                    Components.delete(componentId);
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
                            Backbone.history.loadUrl(Backbone.history.fragment);
                        },
                        statusCode: {
                            400: function(res) {
                                var errorMessage = res.responseJSON.map(function(error) { return "- " + error; }).join("\n");
                                notify("error", errorMessage);
                            }
                        }
                    });
                });
            }
        });
    });