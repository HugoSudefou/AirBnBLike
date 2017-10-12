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
}

exports.checkReq = function(requeteZer) {
    if (requeteZer) {
        var tst = new RegExp("@");//"/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/"
        var res = tst.test(requeteZer.email);
        if (requeteZer.pseudo == null || requeteZer.pseudo == '' ||
            requeteZer.nom == null || requeteZer.nom == '' ||
            requeteZer.prenom == null || requeteZer.prenom == '' ||
            requeteZer.email == null || requeteZer.email == '' || res == false ||
            requeteZer.password == null || requeteZer.password == '' ||
            requeteZer.password != requeteZer.confirmPassword ||
            requeteZer.birthday == null || requeteZer.birthday == '' ||
            requeteZer.confirmPassword == null || requeteZer.confirmPassword == '') {
            return false;
        } else {
            return true;
        }
    } else {
        return false;   
    }
};

exports.verifyAccompt = function (mail, pseudo, id) {
    if(id) return Users.findOne({ _id: id});
    else return Users.find({$or: [ { email: mail } , { pseudo: pseudo }  ]});
}
