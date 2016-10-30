var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var deepEqual = require('deep-equal');
var uuid = require('uuid');
var EscapeHelper = require("../helper/escape_key_helper");
var random = require("random-js")();
var Set = require('set-component');

var SolicitationSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        index: true,
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    metamodelSnapshot: {
        type: Schema.Types.Mixed
    },
    dsl: {
        type: Schema.ObjectId, ref: 'Dsl',
        required: [true, 'DSL is required']
    },
    project: {
        type: Schema.ObjectId, ref: 'Project',
        required: [true, 'Project is required']
    },
    status: {
        type: String
    },
    createdDate: {
        type: Date
    }
}, {minimize: false});

SolicitationSchema.methods.getModel = function () {
    var metamodel = JSON.parse(JSON.stringify(this.getMetamodel()));

    var nodes = {};
    var cells = [];

    for (var index in metamodel) {
        var nodeMetamodel = metamodel[index];

        if (nodeMetamodel.type != "link") {
            var node = this.getOrCreateNodeFromMetamodel(nodeMetamodel);
            nodes[node.component.id] = node;
            cells.push(node);
        }
    }

    for (var index in metamodel) {
        var linkMetamodel = metamodel[index];

        if (linkMetamodel.type == "link") {
            var links = this.instantiateAndConnectLinks(linkMetamodel, nodes);
            cells = cells.concat(links);
        }
    }

    return {cells: cells};
};

SolicitationSchema.methods.instantiateAndConnectLinks = function (linkMetamodel, nodes) {
    var links = [];

    for (var index in linkMetamodel.restrictions.sources) {
        var source = linkMetamodel.restrictions.sources[index];

        if (source) {
            var sourceLinks = this.generateLinkForEachTarget(linkMetamodel, nodes[source], nodes);
            links = links.concat(sourceLinks);
        } else {
            var link = JSON.parse(JSON.stringify(linkMetamodel));
            link.id = uuid.v1();
            link.source = generateRandomPosition();
            link.target = generateRandomPosition();

            links.push(link);
        }
    }

    return links;
};

SolicitationSchema.methods.generateLinkForEachTarget = function (linkMetamodel, source, nodes) {
    var links = [];
    var linkRestriction = source.restrictions.links[linkMetamodel.component.id];

    if (linkRestriction) {
        for (var index in linkRestriction.targets) {
            var targetRestriction = linkRestriction.targets[index];
            var target = nodes[targetRestriction.id];

            var link = JSON.parse(JSON.stringify(linkMetamodel));
            link.id = uuid.v1();
            link.source = {id: source.id};
            link.sourceElement = source.component.id;
            link.target = {id: target.id};
            link.targetElement = target.component.id;

            if (source.id == target.id) {
                var randomP = generateRandomPosition();
                link.vertices = [randomP, {x: randomP.x + 50, y: randomP.y}]
            }


            links.push(link);
        }
    } else {
        var link = JSON.parse(JSON.stringify(linkMetamodel));
        link.id = uuid.v1();
        link.source = {id: source.id};
        link.sourceElement = source.component.id;
        link.target = generateRandomPosition();

        links.push(link);
    }

    return links;
};

SolicitationSchema.methods.getOrCreateNodeFromMetamodel = function (nodeMetamodel) {
    var modelExample = this.dsl.getModelExampleAsObject();

    // try to get from the model example
    var cell = modelExample.cells.filter(function (cell) {
        return cell.component.id == nodeMetamodel.component.id;
    })[0];

    if (cell) {
        // clone metamodel restrictions
        cell.restrictions = JSON.parse(JSON.stringify(nodeMetamodel.restrictions));
    } else {
        cell = this.instantiateNewNode(nodeMetamodel);
    }

    return cell;
};

SolicitationSchema.methods.instantiateNewNode = function (cellMetamodel) {
    // clone metamodel
    var cell = JSON.parse(JSON.stringify(cellMetamodel));
    cell.id = uuid.v1();
    cell.position = generateRandomPosition();
};

// Get the cell metamodel from the snapshot metamodel by the componentId
SolicitationSchema.methods.getCellMetamodelFromSnapshot = function (componentId) {
    return this.metamodelSnapshot.find(function (cellMetamodel) {
        return cellMetamodel.component.id == componentId;
    });
};

// Returns a mix between dsl metamodel and the snapshot metamodel
SolicitationSchema.methods.getMetamodel = function () {
    var metamodelSnapshotEscaped = this.metamodelSnapshot.map(function (cellMetamodel) {
        EscapeHelper.retrieveEscapedChars(cellMetamodel);
        return cellMetamodel;
    });

    var metamodelSnapshotIds = metamodelSnapshotEscaped.map(function (cellMetamodel) {
        return cellMetamodel.component.id
    });

    var dslMetamodel = this.dsl.getMetamodel();

    var dslMetamodelFiltered = dslMetamodel.filter(function (cellDslMetamodel) {
        return metamodelSnapshotIds.indexOf(cellDslMetamodel.component.id) == -1; // not contains
    });

    var metamodelMixed = metamodelSnapshotEscaped.concat(dslMetamodelFiltered);

    return metamodelMixed.map(function (celMetamodel) {
        var cellDslMetamodel = dslMetamodel.filter(function (cellDslMetamodel) {
            return cellDslMetamodel.component.id == celMetamodel.component.id
        })[0];

        if (celMetamodel.type == 'link') {
            return mergeLinkRestrictions(cellDslMetamodel, celMetamodel);
        } else {
            return mergeNodesRestrictions(cellDslMetamodel, celMetamodel);
        }
    });
};

// Generates a random position object { x: random, y: random }
function generateRandomPosition() {
    return {x: random.integer(0, 600), y: random.integer(0, 600)};
}

// Try to merge restrictions from node metamodel of the solicitation with node metamodel of the dsl
// if only the node from the dsl exist return the dsl metamodel
// if only the metamodel from the solicitation exists return it
function mergeNodesRestrictions(nodeFromDsl, nodeMetamodel) {
    if (nodeFromDsl && nodeMetamodel) {
        var metamodel = JSON.parse(JSON.stringify(nodeMetamodel));

        Object.keys(metamodel.restrictions.links).forEach(function (linkId) {

            // merge the targets that are in the dsl that does not in the snapshot
            if (nodeFromDsl.restrictions.links[linkId]) {
                var targetsIds = metamodel.restrictions.links[linkId].targets
                    .map(function (target) {
                        return target.id
                    });

                var dslTargets = nodeFromDsl.restrictions.links[linkId].targets
                    .filter(function (dlsTarget) {
                        return targetsIds.indexOf(dlsTarget.id) == -1; // not contains
                    });

                metamodel.restrictions.links[linkId].targets = metamodel.restrictions.links[linkId].targets
                    .concat(dslTargets);
            }
        });

        return metamodel;
    } else if (nodeFromDsl) {
        return nodeFromDsl;
    } else {
        return nodeMetamodel;
    }
}

// Try to merge restrictions from link metamodel of the solicitation with link metamodel of the dsl
// if only the node from the dsl exist return the dsl metamodel
// if only the metamodel from the solicitation exists return it
function mergeLinkRestrictions(linkFromDsl, linkMetamodel) {
    if (linkFromDsl && linkMetamodel) {
        var metamodel = JSON.parse(JSON.stringify(linkMetamodel));

        linkFromDsl.restrictions.sources.forEach(function (source) {
           if (metamodel.restrictions.sources.indexOf(source) == -1) {
               metamodel.restrictions.sources.push(source);
           }
        });

        return metamodel;
    } else if (linkFromDsl) {
        return linkFromDsl;
    } else {
        return linkMetamodel;
    }
}

module.exports = mongoose.model('Solicitation', SolicitationSchema);