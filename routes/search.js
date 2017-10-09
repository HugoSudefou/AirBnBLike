var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var db;
// Connection URL
var url = 'mongodb://localhost:27017/airbnb';
/* GET home page. */
router.get('/', function(req, res, next) {
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
    if(req.body.dateA != null) dateA = req.body.dateA;
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
// Use connect method to connect to the server
        MongoClient.connect(url, function(err, db) {
            if(err) throw err;
            var collection = db.collection('logements');
            collection.find( query ).toArray(function(err,arr){
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(arr, null, 3));
            });
            db.close();
        });
    }
});

module.exports = router;
