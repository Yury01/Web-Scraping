var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var fs = require('fs');
var News = require('./model/schema');

module.exports = {
  buildCache: function () {
    var site = "http://4pda.ru";
	
	var image = [];
	var uri = [];
	var titles = [];
	var date = [];
	var stext = [];
	var text = [];
	var cache;
	
	request({uri:site,method:'GET',encoding:'binary'}, function(err, response, body) {
		if(!err && response.statusCode == 200) {
			$ = cheerio.load(
                    iconv.encode(
                        iconv.decode(
                            new Buffer(body,'binary'),
                        'win1251'),
                    'utf8')
                );
			
			$("div .visual> a > img").each(function(i, elem) {
					image[i] = $(elem).attr("src");
			});
			
			$("h1 > a").each(function(index, elem) {
				titles[index] = $(elem).text();
				uri[index] = $(elem).attr("href");
			});
			
			$("div .description > div").each(function(index, elem) {
				stext[index] = $(elem).text();
			});
			
			$("div .p-description > em").each(function(i, elem) {
				date[i] = $(elem).text();
			});
		} else {
			console.log("Error" + err);
		}
		
		image.splice(0,1);
		image.forEach(function (item, i, img) {
			if(!fs.existsSync("./public/image/" + item.split("/")[3]))
			    request(item).pipe(fs.createWriteStream("./public/image/" + item.split("/")[3]));
		});
		
		uri.forEach(function (e, i, uri) {
			request({uri:e, method:'GET',encoding:'binary'}, function(err, response, body) {
				if(!err && response.statusCode == 200) {
					$ = cheerio.load(
							iconv.encode(
								iconv.decode(
									new Buffer(body,'binary'),
								'win1251'),
							'utf8')
						);	
					text[i] = $("div .content").html();
				}
			});
		});
		
		titles.forEach(function (e, i, titles) {
			cache = new News({ URN: uri[i].split("/")[6], URI: uri[i], title: titles[i], image: image[i].split("/")[3], newsShort: stext[i], newsFull: text[i], datePublisher: date[i] });
			cache.save(function (err) {
				if (err) console.log(err);
				// saved!
			});
		});
		
	});
  }
};