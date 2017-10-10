// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var logementsSchema = new Schema({
    id: { type: Number, required: true, unique: true},
    ville: { type: String, required: true},
    nbrPersonneMax: { type: Number, required: true},
    dispo: { type: Date, required: true }
});

// the schema is useless so far
// we need to create a model using it
var Logements = mongoose.model('logements', logementsSchema);

// make this available to our Logements in our Node applications
module.exports = Logements;