var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ValidationException = require("./error/validation_exception");
var EscapeHelper = require("../helper/escape_key_helper");

var DslSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        index: true
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    metadata: {
        type: String
    },
    components: {
        type: Array
    }
});

DslSchema.methods.addNewComponent = function (component) {
    validateComponent(this, component);

    EscapeHelper.escapeKeys(component);

    this.components.push(component);
    this.save();
};

DslSchema.methods.getComponents = function (type) {
    var components = this.components.map(function(component) {
        EscapeHelper.retrieveEscapedChars(component);
        return component;
    });

    if (type) {
        return components.filter(function (component) {
            return component.component.type == type;
        });
    }

    return components;
};

DslSchema.methods.getComponentById = function (componentId) {
    var components = this.components.filter(function(component) {
        return component.component.id == componentId;
    }).map(function(component) {
        EscapeHelper.retrieveEscapedChars(component);
        return component;
    });

    return components[0];
};

DslSchema.methods.prepareToUpdateComponent = function (newComponent) {
    validateEdit(newComponent);
    EscapeHelper.escapeKeys(newComponent);
    return newComponent;
};


DslSchema.methods.deleteComponent = function (componentId) {
    var component = this.getComponentById(componentId);
    var index = this.components.indexOf(component);

    this.components.splice(index, 1);
    this.markModified('components');
    this.save();
};

DslSchema.methods.updateInfo = function (info) {
    var newComponents = info.components;
    var metadadata = info.metadata;

    for (var index in newComponents) {
        newComponents[index] = this.prepareToUpdateComponent(newComponents[index]);
    }

    this.components = newComponents;
    this.metadata = metadadata;
    this.markModified('components');
    this.save();
};


function validateEdit(component) {
    if (component == null) {
        throw new ValidationException(["Component can not be null"]);
    }

    var errors = [];

    if (!component.component.id || !component.component.id.trim()) {
        errors.push("Component id is mandatory");
    }

    if (!component.component.friendlyName || !component.component.friendlyName.trim()) {
        errors.push("Component name is mandatory");
    }

    if (!component.component.image || !component.component.image.trim()) {
        errors.push("Component image is mandatory");
    }

    if (errors.length != 0) {
        throw new ValidationException(errors);
    }
}


function validateComponent(dsl, component) {
    if (component == null) {
        throw new ValidationException(["Component can not be null"]);
    }

    var errors = [];

    if (!component.component.id || !component.component.id.trim()) {
        errors.push("Component id is mandatory");
    }

    if (!component.component.friendlyName || !component.component.friendlyName.trim()) {
        errors.push("Component name is mandatory");
    }

    if (!component.component.image || !component.component.image.trim()) {
        errors.push("Component image is mandatory");
    }

    var repeatedComponentId = dsl.components.filter(function (savedComponent) {
        return savedComponent.component.id == component.component.id;
    });

    if (repeatedComponentId.length != 0) {
        errors.push("The component id already exist on this dsl, please choose other");
    }

    if (errors.length != 0) {
        throw new ValidationException(errors);
    }
}


module.exports = mongoose.model('Dsl', DslSchema);