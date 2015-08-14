var utils = require('./utils.js');
var util = require('util');
var async = require('async');
var calendar = require('./calendar.js');
var kodi = require('./kodi.js');

module.exports = {
  getCards: function (callback) {
  	getCards(callback);
  }
};



function getCards(callback){
	var maxCards = 4;
	var cards = [];
	calendar.getHolidays(function(calEvent){
		if(typeof calEvent !== 'undefined'){
			cards.push(calEvent);
			kodi.getEpisodeCards(maxCards-1, function(data) {
				//Adds cal event to end of da LIST!
				cards = data.concat(cards);
				callback(cards);
			});	

		}else{	
			kodi.getEpisodeCards(maxCards, function(data) {
				callback(data);
			});	
		}


	});
}