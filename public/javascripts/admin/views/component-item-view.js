define(["backbone", "underscore", "text!templates/component-item-view.html"],
    function (Backbone, _, componentItemTemplate) {

        return Backbone.View.extend({
            template: _.template(componentItemTemplate),
            className: "list-group-item",

            initialize: function(options) {
                this.options = options;
            },

            render: function () {
                this.$el.html(this.template({ model: this.getComponent(), edit: this.options.edit }));
                return this;
            },

            getComponent: function() {
                var component = this.model;
                delete component.id;
                return component;
            }
        });
    });