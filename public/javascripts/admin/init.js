require(["/javascripts/config.js"], function () {

    require(["backbone", "jquery-ui-layout", "bootstrap-ui"], function (Backbone) {
        $('#main').layout({
            resizable: true,
            applyDefaultStyles: true,
            west: {size: 200},
            east: {size: 300},
            south: {size: 150, initClosed: true}
        });

        $('#east').layout({
            resizable: false,
            applyDefaultStyles: true,
            south: { size: 150, closable: false }
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

        window.router.on('route:tryDsl', function() {
            tryDsl();
        });

        window.router.on('route:createNewNode', function() {
            newNode();
        });

        window.router.on('route:createNewLink', function() {
            newLink();
        });

        window.router.on('route:edit', function(id) {
            editComponent(id);
        });

        Backbone.history.start();
    });

    function tryDsl() {
        require(["views/layout/center", "views/layout/west", "views/component-list-view",
                "scripts/admin/admin-graph", "scripts/admin/admin-paper", "joint", "views/toolbars/try-dsl-toolbar-view"],
            function (Center, West, ComponentListView, AdminGraph, AdminPaper, joint, Toolbar) {
                window.graph = new joint.dia.Graph();

                window.center = new Center({
                    model: graph
                }).render();

                window.west = new West({
                    listView: new ComponentListView(),
                    toolbar: new Toolbar()
                }).render();

                $("#east-content").empty();

                var smallPaper = new AdminPaper({
                    el: $("#preview"),
                    height: 600,
                    width: 600,
                    gridSize: 1,
                    model: graph
                });

                smallPaper.scale(.2);
                smallPaper.$el.css('pointer-events', 'none');
            });
    }

    function newNode() {
        require(["views/layout/center", "views/layout/west", "views/new-node-list-view",
                "scripts/admin/admin-graph", "scripts/admin/admin-paper", "views/toolbars/new-component-toolbar-view"],
            function (Center, West, NodeListView, AdminGraph, AdminPaper, Toolbar) {
                window.graph = new AdminGraph();

                window.center = new Center({
                    model: graph
                }).render();

                window.west = new West({
                    listView: new NodeListView(),
                    toolbar: new Toolbar()
                }).render();

                $("#east-content").empty();

                var smallPaper = new AdminPaper({
                    el: $("#preview"),
                    height: 600,
                    width: 600,
                    gridSize: 1,
                    model: graph
                });

                smallPaper.scale(.2);
                smallPaper.$el.css('pointer-events', 'none');
            });
    }

    function newLink() {
        require(["views/layout/center", "views/layout/west", "views/new-link-list-view",
                "scripts/admin/admin-graph", "scripts/admin/admin-paper", "views/toolbars/new-component-toolbar-view"],
            function (Center, West, LinkListView, AdminGraph, AdminPaper, Toolbar) {
                window.graph = new AdminGraph();

                window.center = new Center({
                    model: graph
                }).render();

                window.west = new West({
                    listView: new LinkListView(),
                    toolbar: new Toolbar()
                }).render();

                $("#east-content").empty();

                var smallPaper = new AdminPaper({
                    el: $("#preview"),
                    height: 600,
                    width: 600,
                    gridSize: 1,
                    model: graph
                });

                smallPaper.scale(.2);
                smallPaper.$el.css('pointer-events', 'none');
            });
    }

    function editComponent(componentId) {
        require(["views/layout/center", "views/layout/west", "views/edit-component-list-view",
                "scripts/admin/admin-graph", "scripts/admin/admin-paper", "views/toolbars/edit-component-toolbar-view"],
            function (Center, West, EditComponentListView, AdminGraph, AdminPaper, Toolbar) {
                window.graph = new AdminGraph();

                var editComponentListView = new EditComponentListView({ id: componentId });

                window.west = new West({
                    listView: editComponentListView,
                    toolbar: new Toolbar()
                }).render();

                window.center = new Center({
                    model: graph
                }).render();

                window.graph.addCell(editComponentListView.getEditingComponent());

                $("#east-content").empty();

                var smallPaper = new AdminPaper({
                    el: $("#preview"),
                    height: 600,
                    width: 600,
                    gridSize: 1,
                    model: graph
                });

                smallPaper.scale(.2);
                smallPaper.$el.css('pointer-events', 'none');
            });
    }
});