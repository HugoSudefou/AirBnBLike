// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);
// create a schema
var logementsSchema = new Schema({
    ville: { type: String, required: true},
    nbrPersonneMax: { type: Number, required: true},
    dispo: { type: Date, required: true }
});

logementsSchema.plugin(autoIncrement.plugin, 'logements');

// the schema is useless so far
// we need to create a model using it
var Logements = mongoose.model('logements', logementsSchema);

// make this available to our Logements in our Node applications
module.exports = Logements;