var mongoose = require('mongoose');
var express = require('express');
var nodemailer = require('nodemailer');
var jwt    = require('jsonwebtoken');
var Users = require('../models/users');
var querystring = require('querystring');
var request = require('request');
var mesFonc = require('../module/fonc');
var app = express();
var config = require('../config');

app.set('superSecret', config.secret); // secret variable
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    res.write('Page Email');
});

router.post('/send', function(req, res, next) {
    var idUserSend = false,
        idUserRecive = false,
        msg = false,
        date = new Date();

    if(req.body.idUserSend) idUserSend = req.body.idUserSend;
    if(req.body.idUserRecive) idUserRecive = req.body.idUserRecive;
    if(req.body.msg) msg = req.body.msg;

    if(idUserRecive && idUserSend && msg){
        var newMsg ={
                idUserSend: idUserSend,
                message: msg,
                date: date
            };
        var promise = Users.find({'_id': {$in : [idUserSend, idUserRecive]}}).exec();
            promise.then(function (data) {
                console.log('data : ');
                console.log(data);
                Users.findOne({'_id': idUserRecive}, function (err, data) {
                    if (err) throw err;
                    else {
                        console.log('err : ');
                        console.log(err);
                        console.log('data : ');
                        console.log(data);
                        var insert = Users.update({'_id': idUserRecive},{ $push : {message: newMsg}});
                        insert.then(function (data) {
                            console.log('data : ');
                            console.log(data);
                        }).catch(function (err) {
                            if (err) throw err
                        });
                    }
                });
                if(data[0] != undefined) {

                    var pseudoSend = "";
                    var pseudoRecive = "";
                    var emailRecive = "";
                    var emailSend = "";
                    if (data[0].id == idUserSend) {
                        pseudoSend = data[0].pseudo;
                        emailSend = data[0].email;
                        pseudoRecive = data[1].pseudo;
                        emailRecive = data[1].email;
                    }
                    else {
                        pseudoSend = data[1].pseudo;
                        emailSend = data[1].email;
                        pseudoRecive = data[0].pseudo;
                        emailRecive = data[0].email;
                    }
                    console.log("Nouveau message envoyé par : " + pseudoSend + ", reçu par : " + pseudoRecive + " pour lui dire : " + msg + ", le : " + date)

                    var sender = {"pseudo": pseudoSend, "email": emailSend};
                    var recipient = {"pseudo": pseudoRecive, "email": emailRecive};
                    var subject = 'Vous avez reçu un message de la part de ' + pseudoSend;
                    var mail = mesFonc.sendMail(sender, recipient, subject, msg);
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(mail, null, 3));
                }
                else{
                    var error = {error: true, message: "problème on ne trouve personne sur les id demandé"};
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(error, null, 3));
                }

            }).catch(function (err) {
                // just need one of these
                console.log('error:', err);
            });
    }

});

router.post('/history', function(req, res, next) {

    if(req.body.idUser) idUser = req.body.idUser;
    console.log('req.body : ');
    console.log(req.body);
    var msg = [];
    var promise = Users.find({"message.idUserSend":idUser})
        .then(function (data) {
            console.log('data : ');
            console.log(data);
            res.setHeader('Content-Type', 'application/json');
            data.forEach(function(data, index, arr) {
                msg.push(data.message);
            });

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(msg, null, 3));
        })
        .catch(function (err) {
            console.log('error:', err);
        });
});

module.exports = router;
