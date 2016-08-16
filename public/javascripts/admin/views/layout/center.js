define(["backbone", "scripts/admin/admin-paper"], function (Backbone, AdminPaper) {

        var Center = Backbone.View.extend({
            el: $("#center"),
            render: function () {
                this.$el.empty();
                this.paper = new AdminPaper({ el: this.$el, model: this.model });
                this.paper.render();
                return this;
            }
        });

        return Center;
    });
