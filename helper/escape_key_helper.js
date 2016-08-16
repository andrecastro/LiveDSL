var helpers = {};

helpers.escapeKeys = function(obj) {
    if (!(Boolean(obj) && typeof obj == 'object'
        && Object.keys(obj).length > 0)) {
        return false;
    }

    Object.keys(obj).forEach(function(key) {
        if (typeof(obj[key]) == 'object') {
            var newKey = replaceIllegalChar(obj, key);
            helpers.escapeKeys(obj[newKey]);
        } else {
            replaceIllegalChar(obj, key);
        }
    });

    return true;
};

helpers.retrieveEscapedChars = function(obj) {
    if (!(Boolean(obj) && typeof obj == 'object'
        && Object.keys(obj).length > 0)) {
        return false;
    }

    Object.keys(obj).forEach(function(key) {
        if (typeof(obj[key]) == 'object') {
            var newKey = replaceToCorrectChar(obj, key);
            helpers.retrieveEscapedChars(obj[newKey]);
        } else {
            replaceToCorrectChar(obj, key);
        }
    });

    return true;
};

function replaceIllegalChar(obj, key) {
    var newkey = key;

    if (key.indexOf('.') !== -1) {
        newkey = key.replace(/\./g, '\uff0E');
        obj[newkey] = obj[key];
        delete obj[key];
    }

    return newkey;
}

function replaceToCorrectChar(obj, key) {
    var newkey = key;

    if (key.indexOf('\uff0E') !== -1) {
        newkey = key.replace(/\uff0E/g, '.');
        obj[newkey] = obj[key];
        delete obj[key];
    }

    return newkey;
}

module.exports = helpers;