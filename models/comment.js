var mongoose = require('mongoose');

var ComSchema = mongoose.Schema({
    comment: String,
    newsId: String,
    user: String,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Comments', ComSchema);
