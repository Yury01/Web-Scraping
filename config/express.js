var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var engine  = require('ejs-locals');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var flash = require('connect-flash');
var session = require('express-session');

var routes = require('../routes');
var routesU = require('../routes/users');

module.exports = function(app) {
    var env = process.env.NODE_ENV || 'development';
    app.locals.ENV = env;
    app.locals.ENV_DEVELOPMENT = env === 'development';

    app.engine('ejs', engine);
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'ejs');

    app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, '../public')));

    app.use(session({ secret: 'mysecret',
        resave: true,
        saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());

    require('./passport')(passport);

    app.use(routes.index);
    app.use(routesU.users);

    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
              message: err.message,
              error: err,
              title: 'error'
          });
        });
    }

    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {},
            title: 'error'
        });
    });
};
