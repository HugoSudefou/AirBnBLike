var mongoose = require('mongoose');
var express = require('express');
var nodemailer = require('nodemailer');
var Users = require('../models/users');
var Msg = require('../models/msg');
var querystring = require('querystring');
var request = require('request');

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
        var newMsg = new Msg({
            idUserSend: idUserSend,
            idUserRecive: idUserRecive,
            msg: msg,
            date: date
        });
        newMsg.save();
        var promise = Users.find({'id': {$in : [idUserSend, idUserRecive]}})
            .then(function (data) {
                var pseudoSend =  "";
                var pseudoRecive =  "";
                var emailRecive = "";
                var emailSend = "";
                if(data[0].id == idUserSend) {
                    pseudoSend = data[0].pseudo;
                    emailSend = data[0].email;
                    pseudoRecive =  data[1].pseudo;
                    emailRecive =  data[1].email;
                }
                else {
                    pseudoSend = data[1].pseudo;
                    emailSend = data[1].email;
                    pseudoRecive =  data[0].pseudo;
                    emailRecive =  data[0].email;
                }
                console.log("Nouveau message envoyé par : " + pseudoSend + ", reçu par : " + pseudoRecive + " pour lui dire : " + msg + ", le : " + date)

                var sender = {"pseudo": pseudoSend, "email": emailSend};
                var recipient = {"pseudo": pseudoRecive, "email": emailRecive};
                var subject = 'Vous avez reçu un message de la part de ' + pseudoSend;
                sendMail(sender, recipient, subject, msg);
            }).catch(function (err) {
                // just need one of these
                console.log('error:', err);
            });
    }

});

function sendMail(sender, recipient, subject, message) {

    if(sender && recipient && subject && message){
        var transporter = nodemailer.createTransport(
            {
                service: 'gmail',
                auth: {
                    user: 'testhugo.sudefou@gmail.com',
                    pass: 'Testhugo1!'
                }
            }
        );
        var mailOptions =
            {
                from: sender.email,
                to: recipient.email,
                subject: subject,
                text: message,
                html: '<p><b> ' + subject + ' </b></p><p>' + message + '</p>'
            };

        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });


        transporter.close();
    }
}

router.post('/history', function(req, res, next) {

    if(req.body.idUser) idUser = req.body.idUser;

    var promise = Msg.find({ $or: [ { idUserSend: idUser }, { idUserRecive: idUser } ] })
        .then(function (data) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(data, null, 3));
        })
        .catch(function (err) {
            console.log('error:', err);
        });
});

module.exports = router;
