var express = require('express');
var config = require('./config/config');
var mongoose = require('mongoose');
var parser = require('./parser');

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function() {
    throw new Error('Unable to connect to database at ' + config.db);
});

var app = express();

parser.buildCache();
setInterval(function() {parser.buildCache();}, 60000);

require('./config/express')(app);

app.listen(config.port, function() {
    console.log('Express server listening on port ' + config.port);
});
