var express = require('express');
var weather = require('./weather.js');
var mta = require('./mta.js');
var kodi = require('./kodi.js');
var calendar = require('./calendar.js');
var app = express();
var express = require('express');
var exec = require('child_process').exec;

var chromeKiosk = '/usr/bin/chromium --kiosk --ignore-certificate-errors --disable-restore-session-state "http://localhost:8080"';


app.get('/api/v1/weather', function(req, res) {    
 weather.getToolbarWeather(function(callback){
      res.json(callback);
   });
});

app.get('/api/v1/mta', function(req, res) {    
 mta.getTrainStatus(function(callback){
      res.json(callback);
   });
});

app.get('/api/v1/kodi', function(req, res) {    
 kodi.getRecentEpisodes(function(callback){ 		
      	res.json(callback);
   });
});

app.get('/api/v1/calendar', function(req, res) {    
 calendar.getHolidays(function(callback){ 		
      	res.json(callback);
   });
});
app.use(express.static(__dirname + '/html'));
app.listen(8080);

//Start chrome!
exec(chromeKiosk, function(error,stdout,stderr){});
