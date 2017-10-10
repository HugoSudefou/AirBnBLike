var mongoose = require('mongoose');
var express = require('express');

/*
*
*  A UTILISER POUR CRYPTER LE PASSWORD
*
* */
var bcrypt   = require('bcrypt-nodejs');

/*
*
*  A UTILISER POUR CRYPTER LE PASSWORD
*
* */

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'Express' });
});

module.exports = router;
