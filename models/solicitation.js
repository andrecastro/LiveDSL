var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var deepEqual = require('deep-equal');
var uuid = require('uuid');
var EscapeHelper = require("../helper/escape_key_helper");

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
}, { minimize: false });

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
            link.source = { x: 0, y: 0  }; // TODO fix this
            link.target = { x: 10, y: 0 }; // TODO fix this

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
            link.source = { id: source.id };
            link.sourceElement = source.component.id;
            link.target = { id: target.id };
            link.targetElement = target.component.id;

            if (source.id == target.id) {
                link.vertices = [{"x":224,"y":203}, {"x":284,"y":203}] // TODO fix it
            }


            links.push(link);
        }
    } else {
        var link = JSON.parse(JSON.stringify(linkMetamodel));
        link.id = uuid.v1();
        link.source = { id: source.id };
        link.sourceElement = source.component.id;
        link.target = { x: 0, y: 0 }; // TODO fix this

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
    cell.position = {x: 0, y: 0}; // TODO fix this
};

SolicitationSchema.methods.getMetamodel = function () {
    return this.metamodelSnapshot.map(function(cellMetamodel) {
        EscapeHelper.retrieveEscapedChars(cellMetamodel);
        return cellMetamodel;
    });
};

SolicitationSchema.methods.getCellMetamodelFromSnapshot = function (componentId) {
    return this.metamodelSnapshot.find(function (cellMetamodel) {
        return cellMetamodel.component.id == componentId;
    });
};

module.exports = mongoose.model('Solicitation', SolicitationSchema);