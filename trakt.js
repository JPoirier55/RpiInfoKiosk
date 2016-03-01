var http = require('http');
var util = require('util');
var moment = require('moment');
var utils = require('./utils.js');
var client_id = "cf59ef8a408dedfd2077dc131802a18b0fb0c9b2e6f005629f704e4cb0967286";
var client_secret = "c14a8701d229eaec0a9c623bc5992a24f5df56c817be1681c6389ffdae2e0e02";

var trakt_host_url = "api-v2launch.trakt.tv"
var trakt_recent_tv_url = "calendars/my/shows/new/2016-2-25/14";

var Trakt = require('trakt.tv');
var trakt = new Trakt({
  client_id: client_id,
  client_secret: client_secret,
});
							
module.exports = {
  getRecentTvShows: function (callback) {
    getRecentTvShows(callback);
  }
};



function getRecentTvShows(callback){
	var url = trakt.get_url();
	//console.log(url);

	trakt.exchange_code('6569A350', 'csrf token (state)')
    .then(function(result) {
        // contains tokens & session information 
        // API can now be used with authorized requests
        callback(result);
    })
    .catch(function(err) { 
        // Handles errors
        console.log(err);  
    });

	// var options = {
	//     host: trakt_host_url,
	//     path: trakt_recent_tv_url,
	//     port: 443,
	//     method: 'GET',
	//     timeout: 5000,
	//     headers: {
 //          	'trakt-api-key'     : client_id,
 //  			'trakt-api-version' : '2',
 //      		'content-type'      : 'application/json',
 //      		'Authorization'     :  'Bearer ' + client_secret 
	//     }
	// };

	// utils.downloadFileWithOptions(options, function(jsonStr){
	// 	callback(jsonStr);
	// 	//callback(JSON.parse(jsonStr));
	// });
}
