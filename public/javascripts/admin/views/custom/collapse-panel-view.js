define(["backbone", "underscore", "text!templates/custom/collapse-panel-view.html"],
    function(Backbone, _, collapsePanelTemplate) {

    var CollapsePanel = Backbone.View.extend({
        class: "panel panel-default",
        template: _.template(collapsePanelTemplate),

        initialize: function(options) {
            this.options = options;
        },

        render: function() {
            this.$el.html(this.template({ title: this.options.title, id: this.options.id, link: this.options.link }));

            if (this.options.contentPanel instanceof Backbone.View) {
                this.$(".panel-body").append(this.options.contentPanel.render().el);
            } else {
                this.$(".panel-body").append(this.options.contentPanel);
            }

            return this;
        }

    });

    return CollapsePanel;
});