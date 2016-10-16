var request = require('request');

var apiKey = '449a24ecf4be482da238d3d38563b4a5';
var endi = 'http://www.elnuevodia.com';

module.exports = {
	fetchLatest: fetchLatest,
	fetchTrending: fetchTrending,
	fetchHoroscopes: fetchHoroscopes,
	fetchLottery: fetchLottery	
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

function fetchLottery(filter, cb) {
	request(
	  { 
	  	url: 'https://gfrmservices.azure-api.net/end/v3/lottery', 
	  	headers: {
	  		'Ocp-Apim-Subscription-Key': apiKey
	  	} 
	  }, function (error, response, body) {
  		var bodyObj = JSON.parse(body);
  		var l = bodyObj.lottery[filter.replace(' ', '').toLowerCase()];

		if (l[0].winners) {
			var numWinners = l[0].winners.map(function (val) {
				return parseInt(val, 10);
			});

			cb(numWinners);
		}	

		else {
			var winners = l.map(function (val) {
				return parseInt(val.winner, 10);
			});

			cb(winners);
		}
	});
}