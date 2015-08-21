var utils = require('./utils.js');
var util = require('util');
var async = require('async');
var calendar = require('./calendar.js');
var football = require('./football.js');
var kodi = require('./kodi.js');
var async = require('async');

module.exports = {
  getCards: function (callback) {
  	getCards(callback);
  }
};



function getCards(serverCallback){
	var maxCards = 4;
	var cards = [];
	
	async.parallel([
    	function(callback) {
    		//Any cal events?
			calendar.getHolidays(function(calEvent){
				if(typeof calEvent !== 'undefined' && patsGame.length > 0){
					cards.push(calEvent);
				}
				callback();
			});			        
    	},
    	function(callback) { 
			football.getNextPatsGame(function(patsGame){
				if(typeof patsGame !== 'undefined' && patsGame.length > 0){
					cards.push(patsGame);
				}
				callback();
			});
    	}
	], function(err) { //This is the final callback
		kodi.getEpisodeCards(maxCards - cards.length, function(kodiData) {
				cards = kodiData.concat(cards);				
				serverCallback(cards);
		});			
	});

}
