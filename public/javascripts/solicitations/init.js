require(["/javascripts/config.js"], function () {

    require(["backbone", "jquery-ui-layout", "bootstrap-ui"], function (Backbone) {
        $('#main').layout({
            resizable: false,
            applyDefaultStyles: true,
            west: {size: 200},
            east: {size: 300},
            south: {size: 150, initClosed: true}
        });

        $('#east').layout({
            resizable: false,
            applyDefaultStyles: true,
            south: {size: 150, closable: false}
        });

        var DslRouter = Backbone.Router.extend({
            routes: {
                "": "evaluate",
                "new-node": "createNewNode",
                "new-link": "createNewLink"
            }
        });

        window.router = new DslRouter();

        window.router.on('route:evaluate', function () {
            evaluate();
        });

        Backbone.history.start();
    });

    function evaluate() {
        require(["views/layout/center", "views/layout/west", "views/layout/east", "views/component-list-view",
                "admin-scripts/admin-graph", "admin-scripts/admin-paper", "controllers/solicitations"],
            function (Center, West, East, ComponentListView, AdminGraph, AdminPaper, Solicitations) {
                var solicitation = Solicitations.get();
                window.pallet = solicitation.metamodel;
                window.dslMetamodel = solicitation.dslMetamodel;

                window.graph = new AdminGraph();

                window.east = new East({
                    model: window.graph,
                    Paper: AdminPaper
                }).render();

                var paper = new AdminPaper({
                    model: window.graph,
                    compareCardinalityWithDsl: true
                });

                window.center = new Center({
                    paper: paper,
                    title: "SOLICITATION EVALUATE"
                }).render();

                if (solicitation.model) {
                    window.graph.fromJSON(solicitation.model);
                }
            });
    }
});