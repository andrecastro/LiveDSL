var mongoose = require('mongoose');
var User = require('./models/user');

mongoose.connect('mongodb://localhost/visual_dsl');

var user = new User({
    name: "Admin",
    username:  "admin",
    role: "admin"
});

User.register(user, "admin123", function(err, user) {
    console.log(err);
    console.log(user);
});