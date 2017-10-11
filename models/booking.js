// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var bookingSchema = new Schema({
    idLogement: { type: Number, required: true},
    idUser: { type: Number, required: true},
    dateA: { type: Date, required: true },
    dateD: { type: Date, required: true }
});

// the schema is useless so far
// we need to create a model using it
var Booking = mongoose.model('booking', bookingSchema);

// make this available to our Booking in our Node applications
module.exports = Booking;