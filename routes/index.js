var express = require('express');
var News = require('../models/news');
var Comment = require('../models/comment');
var cache = require('../cache');

var index = express.Router();

index.route('/').all(function(req, res, next) {
    News.find({}, function(err, news) {
        if (err) {
            return next(err);
        }
        countNews(function(r) {
            var page = Math.ceil(r / 10);
            res.render('index', {news: news, page: page, number: 1, user: req.user});

            cache.setCache('/');
            for (var i in news) {
                cache.setCache('/image/' + news[i].image);
            }
        });
    }).sort({_id: -1})
    .skip(0)
    .limit(10);
});

index.route('/page/:id').all(function(req, res, next) {
    var n = req.params.id;
    News.find({}, function(err, news) {
        if (err) {
            return next(err);
        }
        countNews(function(r) {
            var page = Math.ceil(r / 10);
            res.render('index', {news: news, page: page, number: n, user: req.user});

            cache.setCache('/page/' + n);
            for (var i in news) {
                cache.setCache('/image/' + news[i].image);
            }
        });
    }).sort({_id: -1})
    .skip((n - 1) * 10)
    .limit(10);
});

index.route('/view/:id').all(function(req, res, next) {
    News.findOne({newsId: req.params.id}, function(err, news) {
        if (err) {
            return next(err);
        }
        if (!news) {
            return next(err);
        }
        Comment.find({newsId: req.params.id}, function(err, comment) {
            if (err) {
                return next(err);
            }
            res.render('view', {news: news, user: req.user, comment: comment});
        });

        cache.setCache('/view/' + req.params.id);
        //cache.setCache('/image/'+ news.image);
    });
});

index.route('/app.cache').get(function(q, s) {
    cache.setCache('/components/bootstrap/dist/css/bootstrap.min.css');
    cache.setCache('/css/style.css');
    cache.setCache('/components/jquery/dist/jquery.min.js');
    cache.setCache('/components/bootstrap/dist/js/bootstrap.min.js');
    cache.setFallback('/ offline.html');
    s.setHeader('content-type','text/cache-manifest');
    s.end(cache.get());
    //console.log('*********');
    //console.log(cache.get());
    //console.log('*********');
});

function countNews(callback) {
    News.find({}).count(function(err, count) {
        if (err) {return next(err);}
        return callback(count);
    });
}

exports.index = index;
