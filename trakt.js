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
  },
  getSetupData: function(callback) {
    getSetupData(callback);
  },
  setAuth: function(callback) {
    setAuth(callback, code);
  }
};

function getSetupData(callback) {
  callback({
    setup_url : trakt.get_url(),

  });
}

function setAuth(callback, code) {

  	trakt.exchange_code(code)
      .then(function(result) {
          // contains tokens & session information
          // API can now be used with authorized requests
          callback(result);
      })
      .catch(function(err) {
          // Handles errors
          console.log(err);
      });
}


function getRecentTvShows(callback){

}
