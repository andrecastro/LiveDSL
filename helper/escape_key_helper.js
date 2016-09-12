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

helpers.deepEquals = function(o1, o2) {

    if (o1 != null && o2 == null)
        return false;

    if (o1 == null && o2 != null)
        return false;

    if (o1 == null && o2 == null) {
        return true;
    }

    var k1 = Object.keys(o1).sort();
    var k2 = Object.keys(o2).sort();
    if (k1.length != k2.length) return false;
    return k1.zip(k2, function(keyPair) {
        if(typeof o1[keyPair[0]] == typeof o2[keyPair[1]] == "object"){
            return helpers.deepEquals(o1[keyPair[0]], o2[keyPair[1]])
        } else {
            return o1[keyPair[0]] == o2[keyPair[1]];
        }
    }).all();
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