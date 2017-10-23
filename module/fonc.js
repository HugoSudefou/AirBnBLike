var nodemailer = require('nodemailer');

exports.direBonjour = function() {
    console.log('Bonjour !');
};

exports.sendMail = function(sender, recipient, subject, message) {
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
};


