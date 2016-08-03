var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        index: true
    },
    password: {
        type: String
    }
});

UserSchema.plugin(passportLocalMongoose);

UserSchema.statics.registerNew = function(params, callback) {
    var user = new User({
        name: params.name,
        username: params.username
    });

    var err = user.validateSync();

    if (err) {
        return callback(err, undefined);
    }

    User.register(user, params.password, function(err, user) {
       callback(err, user);
    });
};

var User = mongoose.model('User', UserSchema);

module.exports = User;