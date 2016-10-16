var request = require('request');

var apiKey = '449a24ecf4be482da238d3d38563b4a5';
var endi = 'http://www.elnuevodia.com';

module.exports = {
	fetchLatest: fetchLatest,
	fetchTrending: fetchTrending,
	fetchHoroscopes: fetchHoroscopes	
};

function fetchLatest(cb) {
	request(
	  { 
	  	url: 'https://gfrmservices.azure-api.net/end/v3/latest?limit=0', 
	  	headers: {
	  		'Ocp-Apim-Subscription-Key': apiKey
	  	} 
	  }, function (error, response, body) {
  		var bodyObj = JSON.parse(body);
  		var result = {
  			url: endi + bodyObj.latest[0].url,
  			title: bodyObj.latest[0].title
  		};

  		cb(result);
	  });
}

function fetchTrending(cb) {
	request(
	  { 
	  	url: 'https://gfrmservices.azure-api.net/end/v3/news/trending', 
	  	headers: {
	  		'Ocp-Apim-Subscription-Key': apiKey
	  	} 
	  }, function (error, response, body) {
  		var bodyObj = JSON.parse(body);
  		var result = {
  			url: endi + bodyObj.trending_articles.values[0].url,
  			title: bodyObj.trending_articles.values[0].text
  		};

  		cb(result);
	  });
}

function fetchHoroscopes(filter, cb) {
	request(
	  { 
	  	url: 'https://gfrmservices.azure-api.net/end/v3/horoscope', 
	  	headers: {
	  		'Ocp-Apim-Subscription-Key': apiKey
	  	} 
	  }, function (error, response, body) {
  		var bodyObj = JSON.parse(body);
  		var h = bodyObj.horoscopes[filter.toLowerCase()].horoscope;

  		var result = {
  			text: h.text
  		};

  		cb(result);
	  });
}