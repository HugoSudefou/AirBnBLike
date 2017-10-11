// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);
// create a schema
var usersSchema = new Schema({
    pseudo: { type: String, required: true},
    nom: { type: String, required: true},
    prenom: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    birthday: { type: Date, required: true },
    salt: { type: String, required: true }
});
usersSchema.plugin(autoIncrement.plugin, 'users');


// the schema is useless so far
// we need to create a model using it
var Users = mongoose.model('users', usersSchema);

// make this available to our Users in our Node applications
module.exports = Users;