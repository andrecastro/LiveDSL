define(["jquery", "joint"], function ($, joint) {

    function Components() {}

    Components.prototype.getPredefinedNodes = function() {
        var basic = new joint.shapes.basic.Rect({
            size: {width: 100, height: 30},
            attrs: {rect: {fill: 'blue'}, text: {text: "Basic node", fill: 'white'}},
            component: {
                id: "basic-node",
                friendlyName: "Basic",
                image: "/images/basic-node.png",
                type: "NODE"
            },
            restrictions: {
                links: {}
            }
        });

        var ellipse = new joint.shapes.basic.Ellipse({
            size: {width: 100, height: 30},
            attrs: {text: {text: 'Ellipse', fill: 'white'}, ellipse: {fill: 'red'}},
            component: {
                id: "ellipse",
                friendlyName: "Ellipse",
                image: "/images/ellipse-node.png",
                type: "NODE"
            },
            restrictions: {
                links: {}
            }
        });

        var html = new joint.shapes.basic.Rect({
            size: {width: 100, height: 30},
            attrs: {rect: {fill: 'green'}, text: {text: "HTML node", fill: 'white'}},
            component: {
                id: "html",
                friendlyName: "HTML",
                image: "/images/html-node.png",
                type: "NODE"
            },
            restrictions: {
                links: {}
            }
        });

        var image = new joint.shapes.basic.Image({
            size: {width: 100, height: 30},
            attrs: {
                image: {
                    "xlink:href": "/images/image-node.png",
                    width: 1, height: 1
                },
                text: {text: "Image node", fill: 'white'}
            },
            component: {
                id: "image-node",
                friendlyName: "Image",
                image: "/images/image-node.png",
                type: "NODE"
            },
            restrictions: {
                links: {}
            }
        });

        var nodes = [];
        nodes.push(basic.toJSON());
        nodes.push(ellipse.toJSON());
        nodes.push(html.toJSON());
        nodes.push(image.toJSON());

        return nodes;
    };

    Components.prototype.getPredefinedLinks = function() {
        var basicLink = new joint.dia.Link({
            smooth: false,
            attrs: {
                '.connection': { stroke: 'blue' , 'stroke-width': 3, 'stroke-dasharray': '0'},
                '.marker-source': { stroke: 'blue', fill: 'red', d: 'M 10 0 L 0 5 L 10 10 z' },
                '.marker-target': { stroke: 'blue', fill: 'yellow', d: 'M 10 0 L 0 5 L 10 10 z' }
            },
            component: {
                id: "basic-link",
                friendlyName: "Basic",
                image: "/images/link.png",
                type: "LINK"
            },
            restrictions: {
                sources: [null]
            },
            labels: [
                { position: 0.5, attrs: { text: { text: 'label' } } }
            ]
        });

        var links = [];
        links.push(basicLink.toJSON());

        return links;
    };

    Components.prototype.update = function (component) {
        this.prepareToUpdate(component);
        var savedComponent = this.getLocalComponentById(component.component.id);
        var index = window.components.indexOf(savedComponent);

        window.components[index] = component;
        window.west.render();
    };

    Components.prototype.delete = function(componentId) {
        window.graph.getCells().filter(function (cell) {
            return cell.attributes.component.id == componentId;
        }).forEach(function (cell) {
            cell.remove();
        });

        var savedComponent = this.getLocalComponentById(componentId);
        var index = window.components.indexOf(savedComponent);
        window.components.splice(index, 1);
    };

    Components.prototype.getLocalComponentById = function(id) {
        return window.components.filter(function(component) { return component.component.id == id })[0];
    };

    Components.prototype.prepareToUpdate = function (component) {
        delete component.id; //make sure the id is deleted

        if (component.component.type == "LINK") {
            component.vertices = [];
            component.source = { id: null, element: null };
            component.target = { id: null, element: null };
        } else {
            component.position.x = null;
            component.position.y = null;
        }
    };

    return new Components();
});