var News = require('../model/schema');

exports.index = function ( req, res, next ){
  News.find({}, function (err, news){
      if(err) return next(err);

      res.render( 'index', {news: news});
    }).limit(10);
};

exports.view = function( req, res, next ){
  News.findOne({URN : req.params.id}, function(err, news) {
      if(err) return next(err);

      res.render('view', {news: news});
    });
};