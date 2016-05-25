var mongoose = require('mongoose');

var schemaNews = new mongoose.Schema({
    URI: {
        type: String,
        required: true,
        unique: true
    },
    newsId: {
        type: String,
        required: true,
        unique: true
    },
    title: String,
    image: String,
    newsShort: String,
    newsFull: String,
    datePublisher: String,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('News', schemaNews);
