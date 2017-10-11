var mongoose = require('mongoose');
var express = require('express');
var nodemailer = require('nodemailer');
var jwt    = require('jsonwebtoken');
var app = express();
var config = require('../config');

app.set('superSecret', config.secret); // secret variable

var router = express.Router();

router.use(function(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
});
/* GET home page. */
router.get('/', function(req, res, next) {
    res.write('Page Email');
});

router.post('/', function(req, res, next) {

    var sender = false,
        recipient = false,
        subject = false,
        message = false;

    if(req.body.sender) sender = req.body.sender;
    if(req.body.destination) recipient = req.body.destination;
    if(req.body.subject) subject = req.body.subject;
    if(req.body.message) message = req.body.message;

    if(sender && recipient && subject && message){
        sendMail(sender, recipient, subject, message);
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
        console.log('mail option : ');
        console.log(mailOptions);
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });

        transporter.close();

        return mailOptions;
    }
    var error = {'error': true, 'message': "problème lors de l'envoi du mail de confirmation. Cependant le message a bien été envoyez"};
    return error;
}

module.exports = {
    router:router,
    sendMail:sendMail
};
