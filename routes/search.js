var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var jwt    = require('jsonwebtoken');
var mesFonc = require('../module/fonc');
var Logements = require('../models/logements');
var app = express();
var config = require('../config');

app.set('superSecret', config.secret); // secret variable

router.get('/', function(req, res, next) {
    // get all the users
    if(req.param('errorMsg') != null){
        var errorMsg = req.param('errorMsg');
        var param = req.param('param');
        param = param.split(";");
    }
    else{
        var errorMsg = false;
        var param = false;
    }
    res.render('search', { title: 'Express', errorMsg: errorMsg, param: param });
});

router.post('/request', function (req, res) {
    var valider = req.body.valider;

    var ville = false,
        dateA = false,
        dateD = false,
        nbrPersonne = 1;

    if(req.body.nbrPersonne) var nbrPersonne = parseInt(req.body.nbrPersonne);
    if(req.body.ville != null) ville = req.body.ville;
    if(req.body.dateA != null) dateA = new Date(req.body.dateA);
    if(req.body.dateD != null) dateD = req.body.dateD;

    var query = '';

    if(!dateD && !ville) query = {"nbrPersonneMax": { $gte: nbrPersonne } };
    else if(dateD && !ville) query = {"nbrPersonneMax": { $gte: nbrPersonne }, "dispo":{ $gte: new Date( dateD )} };
    else if(!dateD && ville) query = {"ville" : ville, "nbrPersonneMax": { $gte: nbrPersonne } };
    else query = {"ville" : ville, "nbrPersonneMax": { $gte: nbrPersonne }, "dispo":{ $gte: new Date( dateD )} };

    var formValid = false;

    var param = nbrPersonne + ';' + ville + ';' + dateA + ';' + dateD;
    if(dateA > dateD && (dateA && dateD)){
        var errorMsg = "Votre date de départ est inférieur a votre date d'arrivée. Veuillez modifier vos date.";
        res.redirect('/search?errorMsg=' + errorMsg + '&param=' + param);
    }
    else if(valider == 'valider' || valider == 'Valider'){
        formValid = true;
    }
    else {
        var errorMsg = "Une erreur est survenu lors de la validation du formulaire veuillez le recommencer";
        res.redirect('/search?errorMsg=' + errorMsg + '&param=' + param);
    }

    if(formValid){
        var promise = Logements.find(query).exec();

        promise.then(function(data) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(data, null, 3));
        }).catch(function(err){
            // just need one of these
            console.log('error:', err);
        });
    }
});

module.exports = router;
