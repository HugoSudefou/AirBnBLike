var express = require('express');
var router = express.Router();
var Users = require('../models/users');
var bcrypt   = require('bcrypt-nodejs');
var jwt    = require('jsonwebtoken');
var app = express();
var config = require('../config');

app.set('superSecret', config.secret); // secret variable

var email = require('../routes/email');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', function(req, res, next) {

    // find the user
    Users.findOne({
       $or: [ { email: req.body.login } , { pseudo: req.body.login }  ]
    }, function(err, user) {

        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {

            var testBcrypt = bcrypt.compareSync(req.body.password, user.password);
            if (!testBcrypt) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            }else{
                // if user is found and password is right
                // create a token with only our given payload
                // we don't want to pass in the entire user since that has the password
                const payload = {
                    admin: user.admin
                };
                var token = jwt.sign(payload, app.get('superSecret'), {
                    expiresIn: 60*60*24 // expires in 24 hours
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }

        }

    });
});

router.post('/register', function(req, res, next) {

    var promise = verifyAccompt(req.body.email, req.body.pseudo).exec();
    promise.then(function (data) {
        if(data[0] == undefined){
            var password = req.body.password;
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(password, salt, null, function(err, hash) {
                    req.body.password = hash;
                    var allOption = req.body;
                    allOption['salt'] = salt;
                    var newUser = new Users(allOption);
                    newUser.save(function(err2, data) {
                        var sender = {email: "testhugo.sudefou@gmail.com"},
                            recipient = {email: data.email},
                            subject = "Bienvenu sur AirbnbLike",
                            message = "Bonjour " + data     .pseudo + " bienvenu sur notre site";
                        email.sendMail(sender, recipient, subject, message);
                    })
                });
            });
            req.body.password = undefined;

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(req.body, null, 3));

        }
        else{
            var error = {error: true, message: "Ce mail/pseudo est déjà utilisé par un autre compte"};
            res.send(JSON.stringify(error, null, 3));
        }
    }).catch(function (err) {
        if(err) throw err;
    });

});

function verifyAccompt(mail, pseudo) {
    return Users.find({$or: [ { email: mail } , { pseudo: pseudo }  ]});
}

module.exports = router;
