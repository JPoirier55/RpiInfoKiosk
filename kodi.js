var utils = require('./utils.js');
var calendar = require('./calendar.js');
var async = require('async');
var moment = require('moment');
var util = require('util');
var username = 'kodi';
var password = 'desm';
var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
var baseUrl = '192.168.1.2';
//var baseUrl = 'konecny.ddns.net';

module.exports = {
  getEpisodeCards: function (numOfEpisodes, callback){
  	getEpisodeCards(numOfEpisodes, callback);
  }
};

function getEpisodeCards(numOfEpisodes, callback){
	var options = {
	    host: baseUrl,
	    port: 8082,
	    path: '/jsonrpc?request={"jsonrpc":"2.0","id":1,"method":"VideoLibrary.GetRecentlyAddedEpisodes"}',
	    method: 'GET',
	    headers: {
	        'Content-Type': 'application/json',
	        'Authorization': auth
	    }
	};

	utils.downloadFileWithOptions(options, function(data){
		if(!data){
			callback([]);
			return;
		}
		var getRecentEpisodesObj = JSON.parse(data);
		getEpisodesMeta(numOfEpisodes , getRecentEpisodesObj.result.episodes, function(data){
			callback(data);
		});
	});

}

function getEpisodesMeta(numOfEpisodes, recentEpisodesObj, resCallback){
	var episodes = [];
	var size = numOfEpisodes-1;

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
	var path = '/jsonrpc?request={"jsonrpc":"2.0","id":1,"method":"VideoLibrary.GetEpisodeDetails","params":{"episodeid":%s,"properties":["plot","rating","showtitle","season","episode","art","firstaired"]}}"}';
	path = util.format(path, episodeId);

	var options = {
	    host: baseUrl,
	    port: 8080,
	    path: path,
	    method: 'GET',
	    headers: {
	        'Content-Type': 'application/json',
	        'Authorization': auth
	    }
	};

	utils.downloadFileWithOptions(options, function(data){
		episodeObj  = JSON.parse(data);
		var pattern = /\/\/(.*.)\//;
		var deets = episodeObj.result.episodedetails;

		if(deets.plot){
			deets.plot = deets.plot.substring(0,125) + "...";			
		}else{
			deets.plot = "No description available...";
		}

		deets.firstaired = new moment(deets.firstaired).format("ddd, MMM Do");
		deets.kind = "kodi";

		deets.art['tvshow.poster'] = decodeURIComponent(deets.art['tvshow.poster'].match(pattern)[1]);
		deets.art['tvshow.fanart'] = decodeURIComponent(deets.art['tvshow.fanart'].match(pattern)[1]);
		deets.art['tvshow.banner'] = decodeURIComponent(deets.art['tvshow.banner'].match(pattern)[1]);
		
		callback(episodeObj.result.episodedetails);
	});
}