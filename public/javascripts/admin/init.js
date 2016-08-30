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
                "": "tryDsl",
                "new-node": "createNewNode",
                "new-link": "createNewLink"
            }
        });

        window.router = new DslRouter();

        window.router.on('route:tryDsl', function () {
            tryDsl();
        });

        window.router.on('route:createNewNode', function () {
            newNode();
        });

        window.router.on('route:createNewLink', function () {
            newLink();
        });

        Backbone.history.start();
    });

    function tryDsl() {
        require(["views/layout/center", "views/layout/west", "views/layout/east", "views/component-list-view",
                "admin-scripts/admin-graph", "admin-scripts/admin-paper", "admin-views/toolbars/try-dsl-toolbar-view",
                "controllers/dsl_client"],
            function (Center, West, East, ComponentListView, AdminGraph, AdminPaper, Toolbar, DslClient) {
                var dsl = DslClient.get();

                window.graph = new AdminGraph();

                window.east = new East({
                    model: window.graph,
                    Paper: AdminPaper
                }).render();

                var paper = new AdminPaper({
                    model: window.graph
                });

                window.center = new Center({
                    paper: paper,
                    title: "METAMODEL DEFINITION"
                }).render();

                if (dsl.metadata) {
                    window.graph.fromJSON(JSON.parse(dsl.metadata));
                }

                window.components = dsl.components;

                var componentList = new ComponentListView({
                    collection: window.components,
                    enableNew: true,
                    enableDelete: true
                });

                window.west = new West({
                    listView: componentList,
                    toolbar: new Toolbar()
                }).render();
            });
    }

    function newNode() {
        require(["views/layout/center", "views/layout/west", "views/layout/east", "views/component-list-view",
                "admin-scripts/admin-new-graph", "admin-scripts/admin-paper",
                "admin-views/toolbars/new-component-toolbar-view", "controllers/components"],
            function (Center, West, East, ComponentListView, AdminGraph, AdminPaper, Toolbar, Components) {
                window.graph = new AdminGraph();

                window.east = new East({
                    model: window.graph,
                    Paper: AdminPaper
                }).render();

                var paper = new AdminPaper({
                    model: window.graph,
                    changeComponentId: true
                });

                window.center = new Center({
                    paper: paper,
                    title: "NEW NODE"
                }).render();

                window.components = Components.getPredefinedNodes();

                window.west = new West({
                    listView: new ComponentListView({ collection: window.components, showLinks: false }),
                    toolbar: new Toolbar()
                }).render();
            });
    }

    function newLink() {
        require(["views/layout/center", "views/layout/west", "views/layout/east", "views/component-list-view",
                "admin-scripts/admin-new-graph", "admin-scripts/admin-paper",
                "admin-views/toolbars/new-component-toolbar-view", "controllers/components"],
            function (Center, West, East, ComponentListView, AdminGraph, AdminPaper, Toolbar, Components) {
                window.graph = new AdminGraph();

                window.east = new East({
                    model: window.graph,
                    Paper: AdminPaper
                }).render();

                var paper = new AdminPaper({
                    model: window.graph,
                    changeComponentId: true
                });

                window.center = new Center({
                    paper: paper,
                    title: "NEW NODE"
                }).render();

                window.components = Components.getPredefinedLinks();

                window.west = new West({
                    listView: new ComponentListView({ collection: window.components, showNodes: false }),
                    toolbar: new Toolbar()
                }).render();
            });
    }
});