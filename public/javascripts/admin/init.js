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
                "": "metamodeling",
                "new-node": "createNewNode",
                "new-link": "createNewLink"
            }
        });

        window.router = new DslRouter();

        window.router.on('route:metamodeling', function () {
            metamodeling();
        });

        window.router.on('route:createNewNode', function () {
            newNode();
        });

        window.router.on('route:createNewLink', function () {
            newLink();
        });

        $(window).bind('beforeunload', function(){
            return 'Are you sure you want to leave?';
        });

        Backbone.history.start();
    });

    function metamodeling() {
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

                if (dsl.modelExample) {
                    window.graph.fromJSON(JSON.parse(dsl.modelExample));
                }

                window.pallet = dsl.pallet;

                var componentList = new ComponentListView({
                    collection: window.pallet,
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
                "admin-views/toolbars/new-component-toolbar-view", "controllers/pallet", "controllers/dsl_client"],
            function (Center, West, East, ComponentListView, AdminGraph, AdminPaper, Toolbar, Pallet, DslClient) {
                var dsl = DslClient.get();

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

                window.pallet = Pallet.getPredefinedNodes();
                window.pallet = window.pallet.concat(dsl.pallet);

                window.west = new West({
                    listView: new ComponentListView({ collection: window.pallet, showLinks: false }),
                    toolbar: new Toolbar()
                }).render();
            });
    }

    function newLink() {
        require(["views/layout/center", "views/layout/west", "views/layout/east", "views/component-list-view",
                "admin-scripts/admin-new-graph", "admin-scripts/admin-paper",
                "admin-views/toolbars/new-component-toolbar-view", "controllers/pallet", "controllers/dsl_client"],
            function (Center, West, East, ComponentListView, AdminGraph, AdminPaper, Toolbar, Pallet, DslClient) {
                var dsl = DslClient.get();

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

                window.pallet = Pallet.getPredefinedLinks();
                window.pallet = window.pallet.concat(dsl.pallet);

                window.west = new West({
                    listView: new ComponentListView({ collection: window.pallet, showNodes: false }),
                    toolbar: new Toolbar()
                }).render();
            });
    }
});