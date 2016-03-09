var http = require('http');
var util = require('util');
var moment = require('moment');
var utils = require('./utils.js');
var moment = require('moment');
var client_id = "cf59ef8a408dedfd2077dc131802a18b0fb0c9b2e6f005629f704e4cb0967286";
var client_secret = "c14a8701d229eaec0a9c623bc5992a24f5df56c817be1681c6389ffdae2e0e02";

var NUMBER_OF_DAYS = 14;
var START_DATE = moment().subtract(NUMBER_OF_DAYS-1, 'day').format('YYYY-MM-DD');

var Trakt = require('trakt.tv');
var trakt = new Trakt({
    client_id: client_id,
    client_secret: client_secret,
});

var token_file = '/home/pi/Github/RpiInfoKiosk/trakt_token.json';

module.exports = {
    getRecentTvShows: function(callback, numberOfShows) {
        getRecentTvShows(callback, numberOfShows);
    },
    getSetupData: function(callback) {
        getSetupData(callback);
    },
    setAuth: function(callback, code) {
        setAuth(callback, code);
    }
};

function getSetupData(callback) {
    callback({
        setup_url: trakt.get_url(),
    });
}

function setAuth(callback, code) {
    trakt.exchange_code(code)
        .then(function(result) {
            var token = trakt.export_token();
            utils.writeFile(token_file, JSON.stringify(token));
            callback({
              status: "success"
            });
        })
        .catch(function(err) {
            callback({
              status: "bad request"
            });
        });
}


function getRecentTvShows(callback, numberOfShows) {
  console.log(START_DATE);
  
  utils.readJSONFile(token_file, function(token){
    trakt.import_token(token)
        .then(function(data) {

            trakt.calendars.my.shows({
              start_date: START_DATE,
              days: NUMBER_OF_DAYS,
              extended: 'images,full'
            })
            .then(function(shows) {
                var convertedShows = shows.reverse();
                convertedShows = convertedShows.splice(0, numberOfShows);
                callback(convertTraktShows(convertedShows));
            })
            .catch(function(err) {
               console.log(err);
                callback([]);
            });
        })
        .catch(function(err) {
            console.log(err);
            callback([]);
        });
  });


  function convertTraktShows(shows) {
    var kioskShows = [];
    
    for(var i=0; i<shows.length; i++){      
      var currentShow = shows[i];
      var art = {};
      art['tvshow.banner'] = currentShow.show.images.banner.full;

      var plot = currentShow.episode.overview;
      if(plot && plot.length > 125){
         plot = plot.substring(0,125) + "...";  
      }else if(!plot){
        plot = "No information availible...";
      }
      
     
      kioskShows.push({
        art: art,
        firstaired: new moment(currentShow.first_aired).format("ddd, MMM Do"),
        label: currentShow.episode.title,
        plot: plot,
        showtitle: currentShow.show.title,
        season: currentShow.episode.season,
        episode: currentShow.episode.number,
        kind: "kodi"
      });

    }

    return kioskShows;
  }  

}