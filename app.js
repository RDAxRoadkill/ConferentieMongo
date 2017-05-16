var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
//Sesions
var session = require('express-session');
var memcached = require('connect-memcached')(session);
var cookieStore = new memcached({host: "localhost:8000"});
var flash = require('connect-flash');
var nodemailer = require('nodemailer');
var passwordHash = require('password-hash');
var qr = require('qr-image');
var fs = require('fs');

var app = express();

var port = process.env.PORT || 3000;

//configure
app.set('views', path.join(__dirname + '/public/views' ));
app.set('view engine', 'twig');

//Mongo
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to Mongo');
});


//middleware
app.use(session({secret: '123', cookie: {maxAge: 60000}, resave: false, saveUninitialized: true}));
app.use(favicon(path.join(__dirname, '/public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(flash());
app.use(express.static(path.join(__dirname,'/public')));
app.use('/bower_components', express.static(path.join(__dirname,'/bower_components')));


app.use(require('./routes'));

app.listen(port, function(){
    console.log('----======<<< STARTED ON PORT: ' + port + ' >>>======----');
});

module.exports = app;
