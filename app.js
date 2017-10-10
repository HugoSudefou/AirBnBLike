var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Logements = require('./models/logements');
var Users = require('./models/users');
var Booking = require('./models/booking');

var index = require('./routes/index');
var users = require('./routes/users');
var search = require('./routes/search');
var booking = require('./routes/booking');

// Connection URL
var url = 'mongodb://localhost:27017/airbnb';

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/search', search);
app.use('/booking', booking);



/* GET home page. */
mongoose.Promise = require('bluebird');
mongoose.connect(url, {useMongoClient: true});
console.log('Connection a la base : ');
console.log(mongoose.connection.readyState);

/*
* Permet de remplir la base si elle est vide
* */

var featureLogement =
    [
        {
            id: 1,
            ville: "Nanterre",
            nbrPersonneMax: 5,
            dispo: new Date( '2018-02-02' )
        },
        {
            id: 2,
            ville: "Paris",
            nbrPersonneMax: 2,
            dispo: new Date( '2018-11-10' )
        },
        {
            id: 3,
            ville: "Nice",
            nbrPersonneMax: 7,
            dispo: new Date( '2019-10-08' )
        },
        {
            id: 4,
            ville: "Strasbourg",
            nbrPersonneMax: 3,
            dispo: new Date( '2017-12-11' )
        },
        {
            id: 5,
            ville: "TestVille1",
            nbrPersonneMax: 2,
            dispo: new Date( '2019-08-22' )
        },
        {
            id: 6,
            ville: "TestVille2",
            nbrPersonneMax: 5,
            dispo: new Date( '2018-08-22' )
        },
        {
            id: 7,
            ville: "TestVille3",
            nbrPersonneMax: 4,
            dispo: new Date( '2019-07-12' )
        },
        {
            id: 8,
            ville: "TestVille4",
            nbrPersonneMax: 2,
            dispo: new Date( '2018-10-23' )
        },
        {
            id: 9,
            ville: "TestVille5",
            nbrPersonneMax: 4,
            dispo: new Date( '2019-06-22' )
        },
        {
            id: 10,
            ville: "TestVille6",
            nbrPersonneMax: 5,
            dispo: new Date( '2020-12-31' )
        }
    ];
var featurUser =
    [
        {
            id: 1,
            pseudo: "Pseudo1",
            nom: "Nom1",
            prenom: "Prenom1",
            email: "mail1@mail.fr",
            password: "test",
            birthday: new Date('1995-10-08'),
            salt: "salt1"
        },
        {
            id: 2,
            pseudo: "Pseudo2",
            nom: "Nom2",
            prenom: "Prenom2",
            email: "mail2@mail.fr",
            password: "test",
            birthday: new Date('1995-10-08'),
            salt: "salt2"
        },
        {
            id: 3,
            pseudo: "Pseudo3",
            nom: "Nom3",
            prenom: "Prenom3",
            email: "mail3@mail.fr",
            password: "test",
            birthday: new Date('1995-10-08'),
            salt: "salt3"
        },
        {
            id: 4,
            pseudo: "Pseudo4",
            nom: "Nom4",
            prenom: "Prenom4",
            email: "mail4@mail.fr",
            password: "test",
            birthday: new Date('1995-10-08'),
            salt: "salt4"
        },
        {
            id: 5,
            pseudo: "Pseudo5",
            nom: "Nom5",
            prenom: "Prenom5",
            email: "mail5@mail.fr",
            password: "test",
            birthday: new Date('1995-10-08'),
            salt: "salt5"
        },
        {
            id: 6,
            pseudo: "Pseudo6",
            nom: "Nom6",
            prenom: "Prenom6",
            email: "mail6@mail.fr",
            password: "test",
            birthday: new Date('1995-10-08'),
            salt: "salt6"
        }
    ];


var featurBooking = new Booking({
    idLogement: 1,
    idUser: 1,
    dateA: new Date('2017-11-10'),
    dateD: new Date('2017-11-20')
});
var totalL = featureLogement.length;
var totalU = featurUser.length;
var result = [];

function saveAll(feature, model, total){
    var doc = new model(feature.pop());
    doc.save(function(err, saved){
        if (err) throw err;//handle error

        result.push(saved[0]);

        if (--total) saveAll(feature, model, total);
    })
}
var promiseLogement = Logements.find({}).exec();

promiseLogement.then(function(data) {
    if(!data[0]){
        console.log('rien en base');
        var result = [];
        return saveAll(featureLogement, Logements, totalL);
    }
    console.log("Si il n'y a pas le message 'rien en base' c'est que la base était déjà remplit ____ Logement");

}).catch(function(err){
    // just need one of these
    console.log('error:', err);
});

var promiseUsers = Users.find({}).exec();
promiseUsers.then(function(data) {
    if(!data[0]){
        console.log('rien en base');
        var result = [];
        saveAll(featurUser, Users, totalU);
    }
    console.log("Si il n'y a pas le message 'rien en base' c'est que la base était déjà remplit ____ Users");
}).catch(function(err){
    // just need one of these
    console.log('error:', err);
});

var promiseBooking = Booking.find({}).exec();
promiseBooking.then(function(data) {
    if(!data[0]){
        console.log('rien en base');
        featurBooking.save();
    }
    console.log("Si il n'y a pas le message 'rien en base' c'est que la base était déjà remplit ____ Booking");
}).catch(function(err){
    // just need one of these
    console.log('error:', err);
});

/*
* Permet de remplir la base si elle est vide
* */


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
