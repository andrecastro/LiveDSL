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
    }
});

ProjectSchema.methods.getAvailableComponents = function() {
    var availableComponents = new Set();

    if (this.dsl.metadata) {
        var cells = JSON.parse(this.dsl.metadata).cells;

        for (var index in cells) {
            var cell = cells[index];
            availableComponents.add(this.dsl.getComponentById(cell.component.id));
        }
    }

    return availableComponents.values();
};

var Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
