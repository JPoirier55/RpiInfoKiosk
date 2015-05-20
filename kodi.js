var utils = require('./utils.js');
var async = require('async');
var username = 'admin';
var password = 'desm';
var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');

module.exports = {
  getRecentEpisodes: function (callback) {
  	getRecentEpisodes(callback);
  }
};



function getRecentEpisodes(callback){
	// episodeDetails(2713, function(data){
	// 	console.log("\n\n\n\n\n\n\n\n\n");
	// 	console.log(data);
	// 	callback(JSON.parse(data));
	// });

	var options = {
	    host: 'konecny.ddns.net',
	    port: 8082,
	    path: '/jsonrpc?request={"jsonrpc":"2.0","id":1,"method":"VideoLibrary.GetRecentlyAddedEpisodes"}',
	    method: 'GET',
	    headers: {
	        'Content-Type': 'application/json',
	        'Authorization': auth
	    }
	};

	utils.downloadFileWithOptions(options, function(data){
		var getRecentEpisodesObj = JSON.parse(data);
		getEpisodesMeta(getRecentEpisodesObj.result.episodes, function(data){
			callback(data);
		})	
	});

}


function getEpisodesMeta(recentEpisodesObj, resCallback){
	var episodes = []
	var size = 5

	async.eachSeries(recentEpisodesObj, function(episode, callback) {
		if(episodes.length <= size){				
			episodeDetails(episode.episodeid, function(metaObj){
				episodes.push(metaObj);									
			 	callback();
			});	
		}else{
			callback();
		}

	}, function(err){
		resCallback(episodes);
	});

}

function episodeDetails(episodeId, callback){
	var path = '/jsonrpc?request={"jsonrpc":"2.0","id":1,"method":"VideoLibrary.GetEpisodeDetails","params":{"episodeid":'+episodeId+',"properties":["plot","rating","showtitle","season","episode"]}}"}'

	console.log(path);
	var options = {
	    host: 'konecny.ddns.net',
	    port: 8082,
	    path: path,
	    method: 'GET',
	    headers: {
	        'Content-Type': 'application/json',
	        'Authorization': auth
	    }
	};

	utils.downloadFileWithOptions(options, function(data){
		episodeObj  = JSON.parse(data);
		callback(episodeObj.result.episodedetails);
	});
}