define(["views/factory/components/node-factory", "views/factory/components/link-factory"], function(nodeFactory, linkFactory) {

    return function(type, element, position) {
        switch (type) {
            case "NODE":
                return nodeFactory(element, position);
            default:
                return linkFactory(element, position);
        }
    }
});