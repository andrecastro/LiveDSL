define(["views/layout/center", "app-views/layout/solicitation-warning"], function (Center, SolicitationView) {

    var AppCenter = Center.extend({
        render: function () {
            this.renderSolicitationView();
            return Center.prototype.render.call(this);
        },

        renderSolicitationView: function () {
            if (JSON.stringify(window.pallet) != JSON.stringify(window.dslMetamodel)) {
                this.$("#solicitation-warning").html(new SolicitationView().render().el);
            } else {
                this.$("#solicitation-warning").empty();
            }
        }
    });

    return AppCenter;
});
