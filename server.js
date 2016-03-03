var express = require('express');
var weather = require('./weather.js');
var mta = require('./mta.js');
var kodi = require('./kodi.js');
var trakt = require('./trakt.js');
var calendar = require('./calendar.js');
var cards = require('./cards.js');
var football = require('./football.js');
var app = express();
var express = require('express');
var fs = require('fs');
var moment = require('moment');
var exec = require('child_process').exec;

var chromeKiosk = '/usr/bin/chromium --kiosk --ignore-certificate-errors --disable-restore-session-state "http://localhost:9001"';


app.get('/api/v1/weather', function(req, res) {
 weather.getForecastIOWeather(function(callback){
      res.json(callback);
   });
});
app.get('/api/v1/forecast', function(req, res) {
 weather.getForecastIOWeather(function(callback){
      res.json(callback);
   });
});

app.get('/api/v1/mta', function(req, res) {
 mta.getTrainStatus(function(callback){
      res.json(callback);
   });
});

app.get('/api/v1/calendar', function(req, res) {
 calendar.getHolidays(function(callback){
      	res.json(callback);
   });
});

app.get('/api/v1/cards', function(req, res) {
	cards.getCards(function(callback){
      	res.json(callback);
   	});
});


app.get('/api/v1/football', function(req, res) {
	football.getNextPatsGame(function(callback){
      	res.json(callback);
   	});
});


app.get('/api/v1/kodi', function(req, res) {
   kodi.getEpisodeCards(8, function(callback){
      res.json(callback);
   });
});

app.get('/api/v1/trakt', function(req, res) {
  if(req.query.setup){
    trakt.getSetupData(function(callback){
      res.json(callback);
    });
  }else if(req.query.pin){
    trakt.setAuth(function(callback){
      res.json(callback);
    }, req.query.pin);
    setAuth
  }else{
    trakt.getRecentTvShows(function(callback){
       res.json(callback);
    });
  }

});


app.get('/api/v1/log', function(req, res) {
   fs.readFile('/home/pi/Github/RpiInfoKiosk/python/motion_log.json', 'utf8', function(err, contents) {
      if(!contents){return;}

       var logs = JSON.parse(contents).reverse();
       for(var i=0; i<logs.length; i++){
         if(i > logs.length-1){
            break;
         }

         logs[i].time = new moment(logs[i].time).format('MMMM Do YYYY, h:mm:ss a');
       }
       res.json(logs);
   });
});


app.use(express.static(__dirname + '/html'));
app.listen(9001);

//Start chrome!
exec(chromeKiosk, function(error,stdout,stderr){});
