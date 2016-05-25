var path = require('path');
var rootPath = path.normalize(__dirname + '/..');
var env = process.env.NODE_ENV || 'development';

var config = {
    development: {
        root: rootPath,
        app: {
            name: 'webapp'
        },
        port: process.env.PORT || 3000,
        db: 'mongodb://localhost/webapp1'
    },

    production: {
        root: rootPath,
        app: {
            name: 'webapp1'
        },
        port: process.env.PORT || 3000,
        db: 'mongodb://localhost/webapp1-production'
    }
};

module.exports = config[env];
