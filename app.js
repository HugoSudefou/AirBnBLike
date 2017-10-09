var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var search = require('./routes/search');

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

/*
var insertDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('logement');
  // Insert some documents
    var myobj = [
        {
            ville: "Nanterre",
            nbrPersonneMax: 5,
            dispo: "14/11/17"
        },
        {
            ville: "Lyon",
            nbrPersonneMax: 3,
            dispo: "14/02/18"
        },
        {
            ville: "Marseille",
            nbrPersonneMax: 2,
            dispo: "20/06/18"
        },
        {
            ville: "Nice",
            nbrPersonneMax: 8,
            dispo: "31/08/18"
        },
        {
            ville: "Brest",
            nbrPersonneMax: 4,
            dispo: "05/01/18"
        },
        {
            ville: "Strasbourg",
            nbrPersonneMax: 3,
            dispo: "18/12/17"
        }
    ];
};
*/

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
