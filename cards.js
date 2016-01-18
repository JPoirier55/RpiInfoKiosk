var utils = require('./utils.js');
var util = require('util');
var async = require('async');
var calendar = require('./calendar.js');
var football = require('./football.js');
var kodi = require('./kodi.js');

var carouselEnabled = true;
var carouselCards = 4;


module.exports = {
  getCards: function (callback) {
  	getCards(callback);
  }
};



function getCards(serverCallback){
	var maxCards = 8;
	var cards = [];
	
	async.parallel([
    	function(callback) {
    		//Any cal events?
			calendar.getHolidays(function(calEvent){
				if(typeof calEvent !== 'undefined'){
					cards.push(calEvent);
				}
				callback();
			});			        
    	},
    	function(callback) { 
			football.getNextPatsGame(function(patsGame){
				if(typeof patsGame !== 'undefined'){
					cards.push(patsGame);
				}
				callback();
			});
    	}
	], function(err) { //This is the final callback
		kodi.getEpisodeCards(maxCards - cards.length, function(kodiData) {
				
			cards = kodiData.concat(cards);
			if(carouselEnabled){
				sections = [];
				while (cards.length > 0){
    				sections.push(cards.splice(0, carouselCards));
				}
				
				serverCallback(sections);
			}else{				
				serverCallback(cards);
			}
		});			
	});

}

