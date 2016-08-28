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
                "new-link": "createNewLink",
                "edit/:component_id": "edit"
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
                "scripts/admin/admin-paper", "scripts/admin/admin-graph", "views/toolbars/try-dsl-toolbar-view",
                "controller/dsl_client"],
            function (Center, West, East, ComponentListView, AdminPaper, AdminGraph, Toolbar, DslClient) {
                var dsl = DslClient.get();

                window.graph = new AdminGraph();

                window.east = new East({
                    model: window.graph,
                    Paper: AdminPaper
                }).render();

                window.center = new Center({
                    model: window.graph,
                    Paper: AdminPaper,
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
                "scripts/admin/admin-new-graph", "scripts/admin/admin-paper", "views/toolbars/new-component-toolbar-view",
                "controller/components"],
            function (Center, West, East, ComponentListView, AdminGraph, AdminPaper, Toolbar, Components) {
                window.graph = new AdminGraph();

                window.east = new East({
                    model: window.graph,
                    Paper: AdminPaper
                }).render();

                window.center = new Center({
                    model: window.graph,
                    Paper: AdminPaper,
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
                "scripts/admin/admin-new-graph", "scripts/admin/admin-paper", "views/toolbars/new-component-toolbar-view",
                "controller/components"],
            function (Center, West, East, ComponentListView, AdminGraph, AdminPaper, Toolbar, Components) {
                window.graph = new AdminGraph();

                window.east = new East({
                    model: window.graph,
                    Paper: AdminPaper
                }).render();

                window.center = new Center({
                    model: window.graph,
                    Paper: AdminPaper,
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