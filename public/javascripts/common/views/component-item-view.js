define(["backbone", "underscore", "text!templates/component-item-view.html", "custom/pnotify-bootstrap",
        "controllers/components", "controllers/dsl_client"],
    function (Backbone, _, componentItemTemplate, notify, Components, Dsls) {

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

                if (this.options.enableDelete) {
                    var componentId = this.model.component.id;

                    notify("confirmation", 'Are you sure?').get().on('pnotify.confirm', function(){
                        Components.delete(componentId);
                        var components = window.components;
                        var metadata = window.graph.toJSON();

                        Dsls.updateInfo(components, metadata, function() {
                            notify("success", 'Successfully saved!');
                            Backbone.history.loadUrl(Backbone.history.fragment);
                        }, function(res) {
                            var errorMessage = res.responseJSON.map(function(error) { return "- " + error; }).join("\n");
                            notify("error", errorMessage);
                        });
                    });
                }
            }
        });
    });