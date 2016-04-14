var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var schemaNews = new Schema({
    URI: {
        type: String,
        required: true,
		unique: true
      },
	URN: {
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

mongoose.connect( 'mongodb://localhost/db_news' );
module.exports = mongoose.model( 'News', schemaNews );
