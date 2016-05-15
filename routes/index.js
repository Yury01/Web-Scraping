var News = require('../model/schema');
var cache = require('../cache');

exports.index = function(req, res, next) {
    News.find({}, function(err, news) {
        if (err) {return next(err);}
        countNews(function(r) {
            var page = Math.ceil(r / 10);
            res.render('index', {news: news, page: page, number: 1});

            cache.setCache('/');
            for (var i in news) {
                cache.setCache('/image/' + news[i].image);
            }
        });
    }).sort({_id: -1})
    .skip(0)
    .limit(10);
};

exports.page = function(req, res, next) {
    var n = req.params.id;
    News.find({}, function(err, news) {
        if (err) {return next(err);}
        countNews(function(r) {
            var page = Math.ceil(r / 10);
            res.render('index', {news: news, page: page, number: n});

            cache.setCache('/page/' + n);
            for (var i in news) {
                cache.setCache('/image/' + news[i].image);
            }
        });
    }).sort({_id: -1})
    .skip((n - 1) * 10)
    .limit(10);
};

exports.view = function(req, res, next) {
    News.findOne({URN: req.params.id}, function(err, news, next) {
        if (err) {return next(err);}

        res.render('view', {news: news});

        cache.setCache('/view/' + req.params.id);
        //cache.setCache('/image/'+ news.image);
    });
};

exports.cache = function(req, res) {
    cache.setCache('/components/bootstrap/dist/css/bootstrap.min.css');
    cache.setCache('/css/style.css');
    cache.setCache('/components/jquery/dist/jquery.min.js');
    cache.setCache('/components/bootstrap/dist/js/bootstrap.min.js');
    cache.setFallback('/ offline.html');
    res.setHeader('content-type','text/cache-manifest');
    res.end(cache.get());
};

function countNews(callback) {
    News.find({}).count(function(err, count) {
        if (err) {return next(err);}
        return callback(count);
    });
}
