/**
 * Module dependencies.
*/
var express = require('express');
var http    = require('http');
var path    = require('path');
var engine  = require('ejs-locals');
var logger  = require('morgan');
var bot     = require('./bot');

var app    = express();
var routes = require('./routes');

// all environments
app.set('port', process.env.PORT || 3001);
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
app.get('/', routes.index);
app.get('/page/:id', routes.page);
app.get('/view/:id', routes.view);
app.get('/app.cache', routes.cache);

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development only
if ('development' == app.get('env')) {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

bot.buildCache();
setInterval(function() {bot.buildCache();}, 60000);

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
