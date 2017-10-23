var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var jwt    = require('jsonwebtoken');
var mesFonc = require('../module/fonc');
var Logements = require('../models/logements');
var Users = require('../models/users');
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
router.get('/create/form', function(req, res, next) {
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

router.get('/search', function (req, res) {
    var nbrPersonne = req.query.nbrPersonne,
        ville = req.query.ville,
        dateA = req.query.dateA,
        dateD = req.query.dateD,
        valider = req.query.valider;

    if (nbrPersonne == '') nbrPersonne = 0;
    var query = '';

    if((!dateD && !ville) || (dateD == '' && ville == '')) query = {"nbrPersonneMax": { $gte: nbrPersonne } };
    else if((dateD && !ville) || (dateD && !ville == '')) query = {"nbrPersonneMax": { $gte: nbrPersonne }, "dispo":{ $gte: new Date( dateD )} };
    else if((!dateD && ville) || (dateD == '' && ville)) query = {"ville" : ville, "nbrPersonneMax": { $gte: nbrPersonne } };
    else if((!dateD && ville) || (dateD == '' && ville)) query = {"ville" : ville, "nbrPersonneMax": { $gte: nbrPersonne } };
    else query = {"ville" : ville, "nbrPersonneMax": { $gte: nbrPersonne }, "dispo":{ $gte: new Date( dateD )} };

    console.log(query);
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
            console.log('err : ');
            console.log(err);
            // just need one of these
            //console.log('error:', err);
        });
    }
});

router.post('/create', function (req, res) {
    console.log('create');
    var valider = req.body.valider,
        query = '',
        formValid = false,
        ville = null,
        dateMax = null,
        nbrPersonne = null,
        idUser = null,
        verifMail = null;

    if(req.body.nbrPersonne) nbrPersonne = parseInt(req.body.nbrPersonne);
    if(req.body.ville != null) ville = req.body.ville;
    if(req.body.dateMax != null) dateMax = req.body.dateMax;
    if(req.body.idUser != null) idUser = parseInt(req.body.idUser);

    var param = nbrPersonne + ';' + ville + ';' + dateMax;
    if(!ville || !dateMax || !nbrPersonne || !idUser){
        var errorMsg = "Une erreur est survenu lors de la validation du formulaire veuillez le recommencer";
        res.redirect('/logement/create/form?errorMsg=' + errorMsg + '&param=' + param);
    }
    else{
        formValid = true;
    }

    if(formValid){
        var allOption = {
            'idUser': idUser,
            'ville': ville,
            'nbrPersonneMax': nbrPersonne,
            'dispo': dateMax
        };

        console.log(allOption);
        var newLogement = new Logements(allOption);
        newLogement.save(function (data) {
            var verifCompte = Users.findOne({ _id: idUser});
            verifCompte.then(function (data) {
                var sender = {email: "testhugo.sudefou@gmail.com"},
                recipient = {email: data.email},
                subject = "Vous avez ajouté une annonce sur AirbnbLike",
                message = "Bonjour " + data.pseudo + " vous venez de mettre en ligne une nouvelle annonce. Cette annonce est situé " + allOption.ville + " peut acceuillir jusqu'a " + allOption.nbrPersonneMax + " personne(s) jusqu'au " + allOption.dispo;
                mesFonc.sendMail(sender, recipient, subject, message);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(allOption, null, 3));
            }).catch(function(err){
                // just need one of these
                console.log('error:', err);
            });
        });
    }
});

router.put('/update', function (req, res) {
    console.log('create');

    var valider = req.body.valider,
        query = '',
        formValid = false,
        ville = null,
        dateMax = null,
        nbrPersonne = null,
        idLogement = null,
        query = {};

    if(req.body.nbrPersonne) {
        nbrPersonne = parseInt(req.body.nbrPersonne);
        query.nbrPersonneMax = nbrPersonne;
    }
    if(req.body.ville != null) {
        ville = req.body.ville;
        query.ville = ville;
    }
    if(req.body.dateMax != null) {
        dateMax = req.body.dateMax;
        query.dispo = dateMax;
    }
    if(req.body.idLogement != null) idLogement = parseInt(req.body.idLogement);

    var param = nbrPersonne + ';' + ville + ';' + dateMax;
    if( (!ville && !dateMax && !nbrPersonne && !idLogement) || !idLogement){
        var errorMsg = "Une erreur est survenu lors de la validation du formulaire veuillez le recommencer";
        res.redirect('/logement/create/form?errorMsg=' + errorMsg + '&param=' + param);
    }
    else{
        formValid = true;
    }

    if(formValid){
        console.log('query : ');
        console.log(query);

        var verifLogements = Logements.findOneAndUpdate({ _id: idLogement}, {"$set": query}, {new: true});
        verifLogements.then(function (data) {
            idUser = data.idUser;
            console.log('data : ');
            console.log(data);

            var allOption = {
                'ville': data.ville,
                'nbrPersonneMax': data.nbrPersonneMax,
                'dispo': data.dispo
            };
            var verifCompte = Users.findOne({ _id: idUser});
            verifCompte.then(function (data) {
                var sender = {email: "testhugo.sudefou@gmail.com"},
                    recipient = {email: data.email},
                    subject = "Vous avez mis à jour une annonce sur AirbnbLike",
                    message = "Bonjour " + data.pseudo + " vous venez de mettre à jour une annonce que vous aviez mis en ligne. Voici les modification que vous avez fait. Cette annonce est situé " + allOption.ville + " peut acceuillir jusqu'a " + allOption.nbrPersonneMax + " personne(s) jusqu'au " + allOption.dispo;
                mesFonc.sendMail(sender, recipient, subject, message);
            }).catch(function(err){
                // just need one of these
                console.log('error:', err);
            });
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(data, null, 3));
        }).catch(function(err){
            // just need one of these
            console.log('error:', err);
        });
    }
});

router.delete('/delete', function (req, res) {
    var idLogement = null,
        formValid = false;
    if(req.body.idLogement != null) idLogement = parseInt(req.body.idLogement);

    if(!idLogement){
        var errorMsg = "Une erreur est survenu lors de la validation du formulaire veuillez le recommencer";
        res.redirect('/logement/create/form?errorMsg=' + errorMsg + '&param=' + param);
    }
    else formValid = true;

    if(formValid){
        var verifLogements = Logements.findOneAndRemove(({ _id: idLogement}), function(err, data) {
            if (err) throw err;
            else {
                var allOption = data;
                var verifCompte = Users.findOne({ _id: allOption.idUser});
                verifCompte.then(function (data) {
                    var sender = {email: "testhugo.sudefou@gmail.com"},
                        recipient = {email: data.email},
                        subject = "Vous avez supprimé une annonce de AirbnbLike",
                        message = "Bonjour " + data.pseudo + " vous venez de supprimer une annonce que vous aviez mis en ligne. Voici les paramètre de l'annonce que vous avez supprimé. Cette annonce était situé " + allOption.ville + " pouvait acceuillir jusqu'a " + allOption.nbrPersonneMax + " personne(s) et elle était disponible jusqu'au " + allOption.dispo;
                    mesFonc.sendMail(sender, recipient, subject, message);
                });

            }
    });
    }
});

module.exports = router;
