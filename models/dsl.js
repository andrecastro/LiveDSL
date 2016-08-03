var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DslSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        index: true
    }
});

module.exports = mongoose.model('Dsl', DslSchema);