define(["joint"], function (joint) {

    function Pallet() {}

    Pallet.prototype.getPredefinedNodes = function() {
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
                quantityOnGraph: 1,
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
                quantityOnGraph: 1,
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
                quantityOnGraph: 1,
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
                quantityOnGraph: 1,
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

    Pallet.prototype.getPredefinedLinks = function() {
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
            sourceElement: null,
            targetElement: null,
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

    Pallet.prototype.updateMetamodel = function (newCellMetamodel) {
        this.prepareToUpdate(newCellMetamodel);
        var cellMetamodel = this.getCellMetamodelByComponentId(newCellMetamodel.component.id);
        var index = window.pallet.indexOf(cellMetamodel);

        window.pallet[index] = newCellMetamodel;
        window.west.render();
    };

    Pallet.prototype.deleteByComponentId = function(componentId) {
        window.graph.getCells().filter(function (cell) {
            return cell.attributes.component.id == componentId;
        }).forEach(function (cell) {
            cell.remove();
        });

        var cellMetamodel = this.getCellMetamodelByComponentId(componentId);
        var index = window.pallet.indexOf(cellMetamodel);
        window.pallet.splice(index, 1);
    };

    Pallet.prototype.getCellMetamodelByComponentId = function(componentId) {
        return window.pallet.filter(function(cell) { return cell.component.id == componentId })[0];
    };

    Pallet.prototype.prepareToUpdate = function (newCellMetamodel) {
        delete newCellMetamodel.id; //make sure the id is deleted from metamodel

        if (newCellMetamodel.component.type == "LINK") {
            delete newCellMetamodel.oldSource;
            newCellMetamodel.vertices = [];
            newCellMetamodel.source = { id: null};
            newCellMetamodel.target = { id: null};
            newCellMetamodel.sourceElement = null;
            newCellMetamodel.targetElement = null;
        } else {
            newCellMetamodel.position.x = null;
            newCellMetamodel.position.y = null;
        }
    };

    return new Pallet();
});