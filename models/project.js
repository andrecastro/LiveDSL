var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Set = require('set-component');


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
        return this.currentMetamodel;
    }

    return this.dsl.getMetamodel();
};

var Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
