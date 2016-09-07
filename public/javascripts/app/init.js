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
                "": "model"
            }
        });

        window.router = new DslRouter();

        window.router.on('route:model', function () {
            model();
        });

        $(window).bind('beforeunload', function(){
            return 'Are you sure you want to leave?';
        });

        Backbone.history.start();
    });

    function model() {
        require(["views/layout/center", "views/layout/west", "views/layout/east", "views/component-list-view",
                "app-scripts/app-paper", "app-scripts/app-graph", "app-views/toolbars/new-model-toolbar",
                "controllers/projects"],
            function (Center, West, East, ComponentListView, AppPaper, AppGraph, Toolbar, Projects) {
                var project = Projects.get();

                window.graph = new AppGraph();

                window.east = new East({
                    model: window.graph,
                    Paper: AppPaper
                }).render();

                var paper = new AppPaper({
                    model: window.graph
                });

                window.center = new Center({
                    paper: paper,
                    title: "MODEL"
                }).render();

                if (project.model) {
                    window.graph.fromJSON(JSON.parse(project.model));
                }

                window.components = project.components;

                var componentList = new ComponentListView({
                    collection: window.components
                });

                window.west = new West({
                    listView: componentList,
                    toolbar: new Toolbar()
                }).render();
            });
    }
});