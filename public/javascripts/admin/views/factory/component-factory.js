define(["views/factory/components/node-factory", "views/factory/components/link-factory"], function(nodeFactory, linkFactory) {

    return function(model, position) {
        switch (model.component.type) {
            case "NODE":
                return nodeFactory(model, position);
            default:
                return linkFactory(model, position);
        }
    }
});