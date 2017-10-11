// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var msgSchema = new Schema({
    idUserSend: { type: Number, required: true},
    idUserRecive: { type: Number, required: true},
    msg: { type: String, required: true },
    date: { type: Date, required: true }
});

// the schema is useless so far
// we need to create a model using it
var Msg = mongoose.model('msg', msgSchema);

// make this available to our Booking in our Node applications
module.exports = Msg;