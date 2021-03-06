var mongoose = require('mongoose');
var express = require('express');
var jwt    = require('jsonwebtoken');
var mesFonc = require('../module/fonc');
var monmodule = require('../module/fonc');
var app = express();
var config = require('../config');

app.set('superSecret', config.secret); // secret variable

var router = express.Router();

router.use(function(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(req.path == '/user/login' || req.path == '/user/register' || req.path == '/') next();
    else{
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
    }
});
/* GET home page. */
router.get('/', function(req, res, next) {

    mesFonc.direBonjour();
    res.render('index', { title: 'Express', user: false });
});

module.exports = router;
