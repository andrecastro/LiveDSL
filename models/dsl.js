var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ValidationException = require("./error/validation_exception");
var EscapeHelper = require("../helper/escape_key_helper");
var Set = require('set-component');

var DslSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        index: true,
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    modelExample: {
        type: String
    },
    metamodel: {
        type: Schema.Types.Mixed
    },
    pallet: {
        type: Array
    }
}, { minimize: false });

DslSchema.virtual('solicitations', {
    ref: 'Solicitation',
    localField: '_id',
    foreignField: 'dsl'
});

DslSchema.methods.numberOfPendingSolicitations = function () {
    return this.solicitations.filter(function (sol) { return sol.status == "pending" }).length;
};

DslSchema.methods.addNewCellMetamodelToPallet = function (cell, callback) {
    try {
        validateCell(this, cell)
    } catch (e) {
        return callback.call(this, e);
    }

    EscapeHelper.escapeKeys(cell);
    this.pallet.push(cell);

    this.save(function (err) {
        callback.call(this, err);
    });
};

DslSchema.methods.updateInfo = function (info, callback) {
    var newPallet = info.pallet;
    var modelExample = info.modelExample;

    try {
        for (var index in newPallet) {
            newPallet[index] = this.prepareToUpdateCell(newPallet[index]);
        }
    } catch (e) {
        return callback.call(this, e);
    }

    this.modelExample = modelExample;

    this.pallet = newPallet;
    this.markModified('pallet');

    this.calculateMetamodel();
    this.markModified('metamodel');

    this.save(function (err) {
        callback.call(this, err);
    });
};

DslSchema.methods.calculateMetamodel = function() {
    var metamodel = new Set();

    var cells = this.getModelExampleAsObject().cells;

    for (var index in cells) {
        var cell = cells[index];
        var cellMetamodel = this.pallet.filter(function (cellMetamodel) {
            return cellMetamodel.component.id == cell.component.id;
        })[0];
        metamodel.add(cellMetamodel);
    }

    this.metamodel = metamodel.values();
};

DslSchema.methods.getPallet = function (type) {
    var pallet = this.pallet.map(function (cell) {
        EscapeHelper.retrieveEscapedChars(cell);
        return cell;
    });

    if (type) {
        return pallet.filter(function (cell) {
            return cell.component.type == type;
        });
    }

    return pallet;
};

DslSchema.methods.getMetamodel = function () {
    if (this.metamodel)
        return this.metamodel.map(function(cellMetamodel) {
            EscapeHelper.retrieveEscapedChars(cellMetamodel);
            return cellMetamodel;
        });

    return [];
};

DslSchema.methods.getModelExampleAsObject = function () {
    return JSON.parse(this.modelExample);
};

DslSchema.methods.getCellMetamodelByComponentId = function (componentId) {
    var cells = this.pallet.filter(function (cell) {
        return cell.component.id == componentId;
    }).map(function (cell) {
        EscapeHelper.retrieveEscapedChars(cell);
        return cell;
    });

    return cells[0];
};

DslSchema.methods.prepareToUpdateCell = function (newCell) {
    validateEdit(newCell);
    EscapeHelper.escapeKeys(newCell);
    return newCell;
};

function validateEdit(cell) {
    if (cell == null) {
        throw new ValidationException(["Cell metamodel can not be null"]);
    }

    var errors = [];

    if (!cell.component.id || !cell.component.id.trim()) {
        errors.push("Component id is mandatory");
    }

    if (!cell.component.friendlyName || !cell.component.friendlyName.trim()) {
        errors.push("Component name is mandatory");
    }

    if (!cell.component.image || !cell.component.image.trim()) {
        errors.push("Component image is mandatory");
    }

    if (errors.length != 0) {
        throw new ValidationException(errors);
    }
}

function validateCell(dsl, cell) {
    if (cell == null) {
        throw new ValidationException(["Cell metamodel can not be null"]);
    }

    var errors = [];

    if (!cell.component.id || !cell.component.id.trim()) {
        errors.push("Component id is mandatory");
    }

    if (!cell.component.friendlyName || !cell.component.friendlyName.trim()) {
        errors.push("Component name is mandatory");
    }

    if (!cell.component.image || !cell.component.image.trim()) {
        errors.push("Component image is mandatory");
    }

    var repeatedComponentId = dsl.pallet.filter(function (savedCell) {
        return savedCell.component.id == cell.component.id;
    });

    if (repeatedComponentId.length != 0) {
        errors.push("The component id already exist on this dsl, please choose other");
    }

    if (errors.length != 0) {
        throw new ValidationException(errors);
    }
}

module.exports = mongoose.model('Dsl', DslSchema);