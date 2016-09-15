var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Set = require('set-component');
var EscapeHelper = require("../helper/escape_key_helper");
var deepEqual = require('deep-equal')


var ProjectSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        index: true,
        unique: true
    },
    description: {
        type: String
    },
    model: {
        type: String
    },
    user: {
        type: ObjectId, ref: 'User',
        required: [true, 'User is required']
    },
    dsl: {
        type: ObjectId, ref: 'Dsl',
        required: [true, 'DSL is required']
    },
    currentMetamodel: {
        type: Schema.Types.Mixed
    }
});

ProjectSchema.methods.getMetamodel = function() {
    if (this.currentMetamodel) {
        var metamodel = this.currentMetamodel.map(function (cellMetamodel) {
            EscapeHelper.retrieveEscapedChars(cellMetamodel);
            return cellMetamodel;
        });

        return metamodel;
    }

    return this.dsl.getMetamodel();
};

ProjectSchema.methods.getDslMetamodel = function() {
    return this.dsl.getMetamodel();
};

ProjectSchema.methods.updateInfo = function(metamodel, model, callback) {

    if (!deepEqual(metamodel, this.getDslMetamodel())) {
        var newMetamodel = metamodel.map(function (cellMetamodel) {
            EscapeHelper.escapeKeys(cellMetamodel);
            return cellMetamodel;
        });

        this.currentMetamodel = newMetamodel;
        this.markModified('currentMetamodel');
    }

    this.model = model;
    this.save(function (err) {
        callback.call(this, err);
    });

};




var Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
