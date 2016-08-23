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

        window.router.on('route:edit', function (id) {
            editComponent(id);
        });

        Backbone.history.start();
    });

    function tryDsl() {
        require(["views/layout/center", "views/layout/west", "views/layout/east", "views/component-list-view",
                "scripts/admin/admin-paper", "joint", "views/toolbars/try-dsl-toolbar-view", "controller/components"],
            function (Center, West, East, ComponentListView, AdminPaper, joint, Toolbar, Components) {
                window.graph = new joint.dia.Graph();

                window.graph.on('change:source', function (link) {
                    if (link.get('source').id) {
                        var source = this.getElements().filter(function (e) {
                            return e.id == link.get('source').id;
                        });
                        console.log(source[0]);
                    }
                });

                window.graph.on('change:target', function (link) {
                    if (link.get('target').id) {
                        var target = this.getElements().filter(function (e) {
                            return e.id == link.get('target').id;
                        });
                        console.log(target[0]);
                    }
                });

                window.east = new East({
                    model: window.graph,
                    Paper: AdminPaper
                }).render();

                window.center = new Center({
                    model: window.graph,
                    Paper: AdminPaper
                }).render();

                window.components = Components.getAll();

                var componentList = new ComponentListView({
                    collection: window.components,
                    enableEdit: true,
                    enableNew: true
                });

                window.west = new West({
                    listView: componentList,
                    toolbar: new Toolbar()
                }).render();
            });
    }

    function newNode() {
        require(["views/layout/center", "views/layout/west", "views/layout/east", "views/component-list-view",
                "scripts/admin/admin-graph", "scripts/admin/admin-paper", "views/toolbars/new-component-toolbar-view",
                "controller/components"],
            function (Center, West, East, ComponentListView, AdminGraph, AdminPaper, Toolbar, Components) {
                window.graph = new AdminGraph();

                window.east = new East({
                    model: window.graph,
                    Paper: AdminPaper
                }).render();

                window.center = new Center({
                    model: window.graph,
                    Paper: AdminPaper
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
                "scripts/admin/admin-graph", "scripts/admin/admin-paper", "views/toolbars/new-component-toolbar-view",
                "controller/components"],
            function (Center, West, East, ComponentListView, AdminGraph, AdminPaper, Toolbar, Components) {
                window.graph = new AdminGraph();

                window.east = new East({
                    model: window.graph,
                    Paper: AdminPaper
                }).render();

                window.center = new Center({
                    model: window.graph,
                    Paper: AdminPaper
                }).render();

                window.components = Components.getPredefinedLinks();

                window.west = new West({
                    listView: new ComponentListView({ collection: window.components, showNodes: false }),
                    toolbar: new Toolbar()
                }).render();
            });
    }

    function editComponent(componentId) {
        require(["views/layout/center", "views/layout/west", "views/layout/east", "views/edit-component-list-view",
                "scripts/admin/admin-graph", "scripts/admin/admin-edit-paper", "views/toolbars/edit-component-toolbar-view"],
            function (Center, West, East, EditComponentListView, AdminGraph, AdminPaper, Toolbar) {
                var editComponentListView = new EditComponentListView({id: componentId});

                window.graph = new AdminGraph();
                window.east = new East({
                    model: window.graph,
                    Paper: AdminPaper
                }).render();

                window.west = new West({
                    listView: editComponentListView,
                    toolbar: new Toolbar({componentId: componentId})
                }).render();

                window.center = new Center({
                    model: window.graph,
                    Paper: AdminPaper
                }).render();

                window.graph.addCell(editComponentListView.getEditingComponent());
            });
    }
});