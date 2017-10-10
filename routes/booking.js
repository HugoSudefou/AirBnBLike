var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Booking = require('../models/booking');

/* GET home page. */
router.get('/', function(req, res, next) {

});

router.post('/request', function(req, res, next) {

    var valider = req.body.valider;

    var idLogement = false,
        dateA = false,
        dateD = false,
        idUser = false;

    if(req.body.idLogement) var idLogement = parseInt(req.body.idLogement);
    if(req.body.idUser) idUser = req.body.idUser;
    if(req.body.dateA) dateA = req.body.dateA;
    if(req.body.dateD) dateD = req.body.dateD;

    var query = {"idLogement" : idLogement, "dateD":{ $gte: new Date( dateA )} };

    var promise = Booking.findOne(query).exec();

    promise.then(function(data) {
        if(data) return false;
        else return true;

    }).then(function(data) {
        if (data) {
            var newBooking = new Booking(
                {
                    idLogement: idLogement,
                    idUser: idUser,
                    dateA: new Date(dateA),
                    dateD: new Date(dateD)
                }
            );
            console.log(newBooking);
            newBooking.save();
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(newBooking, null, 3));
        }
        else {
            var newBooking = {
                "error": true,
                "message": "Cette annonce est déjà reservé sur cette date"
            };
            console.log('Il y a déjà une réservation sur ces dates.');
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(newBooking, null, 3));
        }
    }).catch(function(err){
        // just need one of these
        console.log('error:', err);
    });
});

module.exports = router;
