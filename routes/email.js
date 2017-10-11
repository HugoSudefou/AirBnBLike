var mongoose = require('mongoose');
var express = require('express');
var nodemailer = require('nodemailer');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log('Page Email');
    res.write('Page Email');
});

router.post('/', function(req, res, next) {
    console.log('Alors askip je passe par la');
    var sender = false,
        recipient = false,
        subject = false,
        message = false;

    if(req.body.sender) sender = req.body.sender;
    if(req.body.destination) recipient = req.body.destination;
    if(req.body.subject) subject = req.body.subject;
    if(req.body.message) message = req.body.message;

    console.log(sender);
    console.log(recipient);
    console.log(subject);
    console.log(message);

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
                from: sender,
                to: recipient,
                subject: subject,
                text: message,
                html: '<b> ' + message + ' </b>'
            };

        console.log(mailOptions);

        /*transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });
        */

        transporter.close();
    }

});
module.exports = router;
