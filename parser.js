var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var fs = require('fs');
var News = require('./models/news');

module.exports = {
    buildCache: function() {
        var site = 'http://4pda.ru';

        var image = [];
        var uri = [];
        var titles = [];
        var date = [];
        var stext = [];
        var imgname = [];
        var newsId = [];
        var cache;

        request({uri: site, method: 'GET', encoding: 'binary'}, function(err, response, body) {
            if (!err && response.statusCode === 200) {
                $ = cheerio.load(
                    iconv.encode(
                        iconv.decode(
                            new Buffer(body,'binary'),
                        'win1251'),
                    'utf8')
                );

                $('div .visual > a > img').each(function(i, elem) {
                    image[i] = $(elem).attr('src');
                });

                $('h1 > a').each(function(index, elem) {
                    titles[index] = $(elem).text();
                    uri[index] = $(elem).attr('href');
                    newsId[index] = uri[index].toString().split('/')[6];
                });

                $('div .description > div').each(function(index, elem) {
                    stext[index] = $(elem).text();
                });

                $('div .p-description > em').each(function(i, elem) {
                    date[i] = $(elem).text();
                });
            } else {
                console.log('Error' + err);
            }
            image.splice(0,1);
            image.forEach(function(item, i) {
                imgname[i] = item.toString().split('/')[3];
                //if (!fs.existsSync('./public/image/' + imgname[i])) {
                request(item).pipe(fs.createWriteStream('./public/image/' + imgname[i]));
                //}
            });

            uri.forEach(function(e, i, uri) {
                request({uri: uri[i], method: 'GET',encoding: 'binary'}, function(err, response, body) {
                    if (!err && response.statusCode === 200) {
                        $ = cheerio.load(
                            iconv.encode(
                                iconv.decode(
                                    new Buffer(body,'binary'),
                                'win1251'),
                            'utf8')
                        );

                        var text = $('div .content').html();

                        var news = News.findOne({URI: uri[i]}, function(err, news) {
                            if (!news) {
                                cache = new News({ newsId: newsId[i], URI: uri[i], title: titles[i],
                                image: imgname[i], newsShort: stext[i], newsFull: text, datePublisher: date[i] });
                                cache.save(function(err) {
                                    if (err) {console.log('');}
                                    //saved!
                                });
                            }
                        });
                    }
                });
            });
        });
    }
};
